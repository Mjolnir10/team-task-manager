import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaPlus, FaUsers, FaArrowLeft, FaUserCog, FaCalendarAlt } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || '';

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #093c5d;
  font-size: 26px;
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

const CreateBtn = styled.button`
  background: linear-gradient(135deg, #093c5d, #3b7597);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(9, 60, 93, 0.3);
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 25px;
`;

const ProjectCard = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectName = styled.h3`
  color: #093c5d;
  font-size: 20px;
  margin-bottom: 10px;
`;

const ProjectDesc = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 18px;
  border-top: 1px solid #eee;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  background: #f5f7fa;
  padding: 6px 12px;
  border-radius: 20px;
`;

const ViewBtn = styled(Link)`
  display: block;
  margin-top: 18px;
  color: #3b7597;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
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

  &::placeholder {
    color: #aaa;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  margin: 8px 0 18px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 15px;
  min-height: 100px;
  resize: vertical;
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
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  svg {
    font-size: 60px;
    color: #ddd;
    margin-bottom: 20px;
  }

  h3 {
    color: #093c5d;
    margin-bottom: 10px;
  }

  p {
    color: #888;
    margin-bottom: 25px;
  }
`;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/projects`, newProject);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Projects</Title>
        <CreateBtn onClick={() => setShowModal(true)}>
          <FaPlus /> Create Project
        </CreateBtn>
      </Header>

      {loading ? (
        <div style={{ color: '#666' }}>Loading...</div>
      ) : projects.length === 0 ? (
        <EmptyState>
          <FaUsers />
          <h3>No projects yet</h3>
          <p>Create your first project to start assigning tasks to your team</p>
          <CreateBtn onClick={() => setShowModal(true)}>
            <FaPlus /> Create Your First Project
          </CreateBtn>
        </EmptyState>
      ) : (
        <ProjectGrid>
          {projects.map(project => (
            <ProjectCard key={project._id}>
              <ProjectName>{project.name}</ProjectName>
              <ProjectDesc>{project.description || 'No description provided'}</ProjectDesc>
              <ProjectMeta>
                <MetaItem><FaUsers /> {project.members?.length || 0} members</MetaItem>
                <MetaItem><FaUserCog /> {project.admin?.name || 'Admin'}</MetaItem>
              </ProjectMeta>
              <ViewBtn to={`/projects/${project._id}`}>View Project →</ViewBtn>
            </ProjectCard>
          ))}
        </ProjectGrid>
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h2>Create New Project</h2>
            </ModalHeader>
            <form onSubmit={handleCreate}>
              <Input
                placeholder="Project name"
                value={newProject.name}
                onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
              <TextArea
                placeholder="Description (optional)"
                value={newProject.description}
                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
              />
              <ButtonGroup>
                <Button type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" primary>Create Project</Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Projects;