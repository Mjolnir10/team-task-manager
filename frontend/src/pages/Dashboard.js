import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import { FaProjectDiagram, FaTasks, FaClipboardList, FaExclamationTriangle, FaPlus, FaArrowRight } from 'react-icons/fa';
import { format, isAfter, parseISO } from 'date-fns';

const Header = styled.div`
  margin-bottom: 35px;
`;

const Title = styled.h1`
  color: #093c5d;
  font-size: 28px;
  margin-bottom: 5px;

  span {
    font-size: 16px;
    color: #666;
    font-weight: 400;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 35px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 14px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
`;

const StatInfo = styled.div``;

const StatValue = styled.h2`
  font-size: 32px;
  color: #093c5d;
  margin-bottom: 3px;
`;

const StatLabel = styled.p`
  color: #888;
  font-size: 14px;
`;

const Section = styled.section`
  margin-bottom: 35px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #093c5d;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ViewAll = styled(Link)`
  color: #3b7597;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ProjectName = styled.h3`
  color: #093c5d;
  font-size: 18px;
  margin-bottom: 5px;
`;

const ProjectDesc = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.5;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

const MetaTag = styled.span`
  font-size: 12px;
  color: #666;
  background: #f5f7fa;
  padding: 5px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CreateCard = styled.div`
  background: linear-gradient(135deg, #093c5d, #3b7597);
  padding: 25px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px dashed rgba(255, 255, 255, 0.3);

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(9, 60, 93, 0.3);
  }

  svg {
    font-size: 35px;
    color: white;
    margin-bottom: 10px;
  }

  p {
    color: white;
    font-weight: 500;
  }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TaskItem = styled.div`
  background: white;
  padding: 18px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const TaskInfo = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h4`
  color: #333;
  font-size: 15px;
  margin-bottom: 4px;
`;

const TaskMeta = styled.p`
  font-size: 13px;
  color: #888;
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;

  svg {
    font-size: 50px;
    color: #ddd;
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 15px;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          axios.get('/api/projects'),
          axios.get('/api/tasks')
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: '#093c5d' }}>Loading dashboard...</div>;
  }

  const todoCount = tasks.filter(t => t.status === 'Todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'InProgress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;
  const overdueCount = tasks.filter(t =>
    t.dueDate && isAfter(new Date(), parseISO(t.dueDate)) && t.status !== 'Done'
  ).length;

  return (
    <>
      <Header>
        <Title>
          Welcome back, {user?.name}
          <br />
          <span>Here's what's happening with your projects</span>
        </Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="#093c5d">
            <FaProjectDiagram />
          </StatIcon>
          <StatInfo>
            <StatValue>{projects.length}</StatValue>
            <StatLabel>Projects</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#6fd1da">
            <FaTasks />
          </StatIcon>
          <StatInfo>
            <StatValue>{todoCount}</StatValue>
            <StatLabel>To Do</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#3b7597">
            <FaClipboardList />
          </StatIcon>
          <StatInfo>
            <StatValue>{inProgressCount}</StatValue>
            <StatLabel>In Progress</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color={overdueCount > 0 ? "#e74c3c" : "#75df8d"}>
            <FaExclamationTriangle />
          </StatIcon>
          <StatInfo>
            <StatValue>{overdueCount}</StatValue>
            <StatLabel>Overdue</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaProjectDiagram /> Your Projects
          </SectionTitle>
          <ViewAll to="/projects">
            View all <FaArrowRight />
          </ViewAll>
        </SectionHeader>
        <ProjectGrid>
          <Link to="/projects">
            <CreateCard>
              <FaPlus />
              <p>Create New Project</p>
            </CreateCard>
          </Link>
          {projects.slice(0, 5).map(project => (
            <Link to={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none' }}>
              <ProjectCard>
                <ProjectHeader>
                  <div>
                    <ProjectName>{project.name}</ProjectName>
                    <ProjectDesc>{project.description || 'No description'}</ProjectDesc>
                  </div>
                </ProjectHeader>
                <ProjectMeta>
                  <MetaTag>{project.members?.length || 0} members</MetaTag>
                  <MetaTag>{user?.name === project.admin?.name ? 'Admin' : project.admin?.name}</MetaTag>
                </ProjectMeta>
              </ProjectCard>
            </Link>
          ))}
        </ProjectGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            <FaTasks /> Recent Tasks
          </SectionTitle>
          <ViewAll to="/tasks">
            View all <FaArrowRight />
          </ViewAll>
        </SectionHeader>
        <TaskList>
          {tasks.length === 0 ? (
            <EmptyState>
              <FaTasks />
              <p>No tasks yet. Create a project first!</p>
            </EmptyState>
          ) : (
            tasks.slice(0, 5).map(task => (
              <TaskItem key={task._id}>
                <TaskInfo>
                  <TaskTitle>{task.title}</TaskTitle>
                  <TaskMeta>
                    {task.project?.name} • {task.assignedTo?.name || 'Unassigned'}
                  </TaskMeta>
                </TaskInfo>
                <Badge bg={task.priority === 'High' ? '#fdeaea' : task.priority === 'Medium' ? '#fef3c7' : '#e8f5e9'}
                  color={task.priority === 'High' ? '#e74c3c' : task.priority === 'Medium' ? '#d97706' : '#22c55e'}>
                  {task.priority}
                </Badge>
                <Badge bg={task.status === 'Done' ? '#e8f5e9' : task.status === 'InProgress' ? '#dbeafe' : '#f3f4f6'}
                  color={task.status === 'Done' ? '#22c55e' : task.status === 'InProgress' ? '#3b82f6' : '#666'}>
                  {task.status}
                </Badge>
              </TaskItem>
            ))
          )}
        </TaskList>
      </Section>
    </>
  );
};

export default Dashboard;