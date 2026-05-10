import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaArrowLeft, FaUsers, FaTasks, FaUserPlus, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { format, parseISO, isAfter } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BackBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;

  &:hover {
    color: #093c5d;
  }
`;

const Title = styled.h1`
  color: #093c5d;
  font-size: 26px;
`;

const Description = styled.p`
  color: #888;
  font-size: 15px;
`;

const ActionBtn = styled.button`
  background: ${props => props.outline ? 'transparent' : 'linear-gradient(135deg, #093c5d, #3b7597)'};
  color: ${props => props.outline ? '#3b7597' : 'white'};
  border: ${props => props.outline ? '2px solid #3b7597' : 'none'};
  padding: 12px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(9, 60, 93, 0.2);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
`;

const CardTitle = styled.h2`
  color: #093c5d;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px;
  background: ${props => props.$overdue ? '#fef2f2' : '#f9fafb'};
  border-radius: 12px;
  margin-bottom: 12px;
  border-left: 4px solid ${props => props.$overdue ? '#e74c3c' : 'transparent'};
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
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #093c5d, #3b7597);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberName = styled.h4`
  color: #333;
  font-size: 14px;
`;

const MemberEmail = styled.p`
  color: #888;
  font-size: 12px;
`;

const RoleBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.$isAdmin ? '#e8f5e9' : '#e3f2fd'};
  color: ${props => props.$isAdmin ? '#22c55e' : '#1976d2'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 35px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  margin-bottom: 25px;

  h2 {
    color: #093c5d;
    font-size: 22px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  margin: 8px 0 18px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #6fd1da;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 18px;
  margin: 8px 0 18px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 15px;
  background: white;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #6fd1da;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  background: ${props => props.primary ? 'linear-gradient(135deg, #093c5d, #3b7597)' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : '#666'};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const EmptyTasks = styled.div`
  text-align: center;
  padding: 40px;
  color: #888;

  p {
    margin-bottom: 15px;
  }
`;

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [newTask, setNewTask] = useState({
    title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        axios.get(`/api/projects/${id}`),
        axios.get(`/api/projects/${id}/tasks`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      // First, find user by email
      const allProjects = await axios.get('/api/projects');
      // Search for user - in a real app, you'd have a search users API
      alert('Member search feature - please use the Team page to find members');
      setShowAddMember(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...newTask, projectId: id });
      setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      setShowAddTask(false);
      fetchProjectData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) return <div style={{ color: '#666' }}>Loading...</div>;
  if (!project) return <div style={{ color: '#666' }}>Project not found</div>;

  const isAdmin = project.admin?._id === user?._id || user?.role === 'Admin';

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackBtn to="/projects">
            <FaArrowLeft /> Back to Projects
          </BackBtn>
          <Title>{project.name}</Title>
          <Description>{project.description || 'No description'}</Description>
        </HeaderLeft>
        <ActionBtn onClick={() => setShowAddTask(true)}>
          <FaPlus /> Add Task
        </ActionBtn>
      </Header>

      <Grid>
        <Card>
          <CardHeader>
            <CardTitle><FaTasks /> Tasks ({tasks.length})</CardTitle>
            <ActionBtn outline onClick={() => navigate('/tasks')}>
              View All
            </ActionBtn>
          </CardHeader>

          {tasks.length === 0 ? (
            <EmptyTasks>
              <FaTasks />
              <p>No tasks yet. Add your first task!</p>
              <ActionBtn onClick={() => setShowAddTask(true)}>
                <FaPlus /> Create Task
              </ActionBtn>
            </EmptyTasks>
          ) : (
            tasks.map(task => {
              const isOverdue = task.dueDate && isAfter(new Date(), parseISO(task.dueDate)) && task.status !== 'Done';
              return (
                <TaskItem key={task._id} $overdue={isOverdue}>
                  <TaskInfo>
                    <TaskTitle>{task.title}</TaskTitle>
                    <TaskMeta>
                      {task.assignedTo?.name || 'Unassigned'} •
                      Due: {task.dueDate ? format(parseISO(task.dueDate), 'MMM dd') : 'No due date'}
                    </TaskMeta>
                  </TaskInfo>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #ddd',
                      fontSize: '12px',
                      background: task.status === 'Done' ? '#e8f5e9' : task.status === 'InProgress' ? '#dbeafe' : 'white'
                    }}
                  >
                    <option value="Todo">To Do</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <Badge bg={task.priority === 'High' ? '#fdeaea' : task.priority === 'Medium' ? '#fef3c7' : '#e8f5e9'}
                    color={task.priority === 'High' ? '#e74c3c' : task.priority === 'Medium' ? '#d97706' : '#22c55e'}>
                    {task.priority}
                  </Badge>
                </TaskItem>
              );
            })
          )}
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle><FaUsers /> Team ({project.members?.length || 0})</CardTitle>
              {isAdmin && (
                <ActionBtn outline onClick={() => setShowAddMember(true)}>
                  <FaUserPlus /> Add
                </ActionBtn>
              )}
            </CardHeader>

            <MemberItem>
              <Avatar>{project.admin?.name?.[0] || 'A'}</Avatar>
              <MemberInfo>
                <MemberName>{project.admin?.name}</MemberName>
                <MemberEmail>{project.admin?.email}</MemberEmail>
              </MemberInfo>
              <RoleBadge $isAdmin>Admin</RoleBadge>
            </MemberItem>

            {project.members?.filter(m => m._id !== project.admin?._id).map(member => (
              <MemberItem key={member._id}>
                <Avatar>{member.name?.[0] || 'M'}</Avatar>
                <MemberInfo>
                  <MemberName>{member.name}</MemberName>
                  <MemberEmail>{member.email}</MemberEmail>
                </MemberInfo>
                <RoleBadge>Member</RoleBadge>
              </MemberItem>
            ))}
          </Card>
        </div>
      </Grid>

      {showAddMember && (
        <Modal onClick={() => setShowAddMember(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h2>Add Team Member</h2>
            </ModalHeader>
            <form onSubmit={handleAddMember}>
              <Input
                type="email"
                placeholder="Member's email address"
                value={memberEmail}
                onChange={e => setMemberEmail(e.target.value)}
                required
              />
              <ButtonGroup>
                <Button type="button" onClick={() => setShowAddMember(false)}>Cancel</Button>
                <Button type="submit" primary>Add Member</Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}

      {showAddTask && (
        <Modal onClick={() => setShowAddTask(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h2>Create New Task</h2>
            </ModalHeader>
            <form onSubmit={handleAddTask}>
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <Input
                as="textarea"
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                style={{ minHeight: '80px', display: 'block', width: '100%', padding: '14px 18px', margin: '8px 0 18px', border: '2px solid #e8e8e8', borderRadius: '10px' }}
              />
              <Select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <option value="">Assign to...</option>
                {project.members?.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </Select>
              <Select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </Select>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <ButtonGroup>
                <Button type="button" onClick={() => setShowAddTask(false)}>Cancel</Button>
                <Button type="submit" primary>Create Task</Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ProjectDetail;