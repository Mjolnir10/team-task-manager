import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaPlus, FaFilter, FaEdit, FaTrash, FaUser, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h1`
  color: #093c5d;
  font-size: 26px;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;

  input {
    padding: 10px 15px 10px 40px;
    border: 2px solid #e8e8e8;
    border-radius: 10px;
    font-size: 14px;
    width: 250px;

    &:focus {
      outline: none;
      border-color: #6fd1da;
    }
  }

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6fd1da;
  }
`;

const CreateBtn = styled.button`
  background: linear-gradient(135deg, #093c5d, #3b7597);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(9, 60, 93, 0.3);
  }
`;

const TaskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const TaskCard = styled.div`
  background: white;
  padding: 22px;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border-left: 5px solid ${props => {
    if (props.$status === 'Done') return '#22c55e';
    if (props.$status === 'InProgress') return '#3b82f6';
    return '#ddd';
  }};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const TaskTitle = styled.h3`
  color: #333;
  font-size: 17px;
  margin-bottom: 5px;
`;

const TaskProject = styled.p`
  color: #3b7597;
  font-size: 13px;
`;

const TaskActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconBtn = styled.button`
  padding: 6px;
  border-radius: 6px;
  color: #999;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const TaskBody = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
  background: #f5f7fa;
  padding: 5px 10px;
  border-radius: 6px;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
`;

const PriorityBadge = styled.span`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.bg};
  color: ${props => props.color};
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
  max-width: 520px;
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

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium', dueDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', newTask);
      setNewTask({ title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tasks/${editingTask._id}`, newTask);
      setNewTask({ title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      setEditingTask(null);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      projectId: task.project?._id,
      assignedTo: task.assignedTo?._id || '',
      priority: task.priority,
      dueDate: task.dueDate ? format(parseISO(task.dueDate), 'yyyy-MM-dd') : ''
    });
    setShowModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !filterProject || task.project?._id === filterProject;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });

  const getPriorityStyles = (priority) => {
    if (priority === 'High') return { bg: '#fdeaea', color: '#e74c3c' };
    if (priority === 'Medium') return { bg: '#fef3c7', color: '#d97706' };
    return { bg: '#e8f5e9', color: '#22c55e' };
  };

  const getStatusStyles = (status) => {
    if (status === 'Done') return { bg: '#e8f5e9', color: '#22c55e' };
    if (status === 'InProgress') return { bg: '#dbeafe', color: '#3b82f6' };
    return { bg: '#f3f4f6', color: '#666' };
  };

  return (
    <Container>
      <Header>
        <Title>Tasks</Title>
        <Controls>
          <SearchInput>
            <FaSearch />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <FilterSelect value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </FilterSelect>
          <FilterSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Todo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </FilterSelect>
          <CreateBtn onClick={() => {
            setEditingTask(null);
            setNewTask({ title: '', description: '', projectId: '', assignedTo: '', priority: 'Medium', dueDate: '' });
            setShowModal(true);
          }}>
            <FaPlus /> Create Task
          </CreateBtn>
        </Controls>
      </Header>

      {loading ? (
        <div style={{ color: '#666' }}>Loading...</div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState>
          <FaFilter />
          <h3>No tasks found</h3>
          <p>Create a task or adjust your filters</p>
        </EmptyState>
      ) : (
        <TaskGrid>
          {filteredTasks.map(task => {
            const priorityStyles = getPriorityStyles(task.priority);
            const statusStyles = getStatusStyles(task.status);
            return (
              <TaskCard key={task._id} $status={task.status}>
                <TaskHeader>
                  <div>
                    <TaskTitle>{task.title}</TaskTitle>
                    <TaskProject>{task.project?.name}</TaskProject>
                  </div>
                  <TaskActions>
                    <IconBtn onClick={() => openEdit(task)}><FaEdit /></IconBtn>
                    <IconBtn onClick={() => handleDelete(task._id)}><FaTrash /></IconBtn>
                  </TaskActions>
                </TaskHeader>
                {task.description && <TaskBody>{task.description}</TaskBody>}
                <TaskMeta>
                  <MetaItem><FaUser /> {task.assignedTo?.name || 'Unassigned'}</MetaItem>
                  {task.dueDate && (
                    <MetaItem><FaCalendarAlt /> {format(parseISO(task.dueDate), 'MMM dd, yyyy')}</MetaItem>
                  )}
                </TaskMeta>
                <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                  <PriorityBadge bg={priorityStyles.bg} color={priorityStyles.color}>
                    {task.priority}
                  </PriorityBadge>
                  <StatusBadge bg={statusStyles.bg} color={statusStyles.color}>
                    {task.status === 'InProgress' ? 'In Progress' : task.status}
                  </StatusBadge>
                </div>
              </TaskCard>
            );
          })}
        </TaskGrid>
      )}

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
            </ModalHeader>
            <form onSubmit={editingTask ? handleUpdate : handleCreate}>
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              <Input
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <Select value={newTask.projectId} onChange={e => setNewTask({ ...newTask, projectId: e.target.value })} required>
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Select>
              <Select value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <option value="">Assign to...</option>
                {projects.find(p => p._id === newTask.projectId)?.members.map(m => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </Select>
              <Select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </Select>
              <Input type="date" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              <ButtonGroup>
                <Button type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" primary>{editingTask ? 'Update Task' : 'Create Task'}</Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Tasks;