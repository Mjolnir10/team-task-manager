import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import { FaUsers, FaSearch, FaEnvelope, FaUserPlus, FaUser, FaProjectDiagram } from 'react-icons/fa';

const Container = styled.div``;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #093c5d;
  font-size: 26px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 15px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 35px;

  @media (max-width: 768px) {
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
  gap: 18px;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;

const StatInfo = styled.div`
  h3 {
    color: #093c5d;
    font-size: 28px;
    margin-bottom: 3px;
  }
  p {
    color: #888;
    font-size: 14px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 20px;

  input {
    width: 100%;
    padding: 12px 15px 12px 45px;
    border: 2px solid #e8e8e8;
    border-radius: 10px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #6fd1da;
    }
  }

  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const UserList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #093c5d, #3b7597);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  color: #333;
  font-size: 15px;
  margin-bottom: 3px;
`;

const UserEmail = styled.p`
  color: #888;
  font-size: 13px;
`;

const RoleBadge = styled.span`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$isAdmin ? '#e8f5e9' : '#e3f2fd'};
  color: ${props => props.$isAdmin ? '#22c55e' : '#1976d2'};
`;

const InviteSection = styled.div`
  margin-top: 15px;
`;

const InviteForm = styled.form`
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #e8e8e8;
    border-radius: 10px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #6fd1da;
    }
  }
`;

const InviteBtn = styled.button`
  background: linear-gradient(135deg, #093c5d, #3b7597);
  color: white;
  padding: 12px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(9, 60, 93, 0.3);
  }
`;

const ProjectSelect = styled.select`
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #6fd1da;
  }
`;

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MemberTag = styled.div`
  background: #f5f7fa;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #888;
  font-size: 14px;
`;

const SuccessMsg = styled.div`
  background: #e8f5e9;
  color: #22c55e;
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const ErrorMsg = styled.div`
  background: #fdeaea;
  color: #e74c3c;
  padding: 12px 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 14px;
`;

const Team = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      setMessage({ type: 'error', text: 'Please select a project first' });
      return;
    }

    try {
      // Search for user by email
      const res = await axios.get(`/api/users/search?q=${inviteEmail}`);
      const foundUser = res.data[0];

      if (!foundUser) {
        setMessage({ type: 'error', text: 'User not found. They must register first.' });
        return;
      }

      // Check if already a member
      if (selectedProjectData.members?.some(m => m._id === foundUser._id)) {
        setMessage({ type: 'error', text: 'User is already a member of this project' });
        return;
      }

      // Add user to project
      await axios.post('/api/users/add-to-project', {
        userId: foundUser._id,
        projectId: selectedProject
      });

      setMessage({ type: 'success', text: `${foundUser.name} added to project successfully!` });
      setInviteEmail('');
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add member' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) return <div style={{ color: '#666' }}>Loading...</div>;

  const allMembers = projects.flatMap(p => p.members || []);
  const uniqueMembers = allMembers.filter((m, i, arr) => arr.findIndex(x => x._id === m._id) === i);

  const filteredMembers = uniqueMembers.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProjectData = projects.find(p => p._id === selectedProject);
  const adminCount = uniqueMembers.filter(m => m.role === 'Admin').length;

  return (
    <Container>
      <Header>
        <Title>Team Management</Title>
        <Subtitle>Manage your team members and project assignments</Subtitle>
      </Header>

      <StatsRow>
        <StatCard>
          <StatIcon color="#093c5d"><FaUsers /></StatIcon>
          <StatInfo>
            <h3>{uniqueMembers.length}</h3>
            <p>Total Members</p>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#3b7597"><FaProjectDiagram /></StatIcon>
          <StatInfo>
            <h3>{projects.length}</h3>
            <p>Active Projects</p>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#75df8d"><FaUser /></StatIcon>
          <StatInfo>
            <h3>{adminCount}</h3>
            <p>Team Admins</p>
          </StatInfo>
        </StatCard>
      </StatsRow>

      <Grid>
        <Card>
          <CardHeader>
            <CardTitle><FaUsers /> All Team Members</CardTitle>
          </CardHeader>
          <SearchBox>
            <FaSearch />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <UserList>
            {filteredMembers.length === 0 ? (
              <EmptyState>No members found</EmptyState>
            ) : (
              filteredMembers.map(member => (
                <UserItem key={member._id}>
                  <Avatar>{member.name?.[0] || 'U'}</Avatar>
                  <UserInfo>
                    <UserName>{member.name}</UserName>
                    <UserEmail>{member.email}</UserEmail>
                  </UserInfo>
                  <RoleBadge $isAdmin={member.role === 'Admin'}>
                    {member.role}
                  </RoleBadge>
                </UserItem>
              ))
            )}
          </UserList>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><FaUserPlus /> Add to Project</CardTitle>
          </CardHeader>

          {message.text && (
            message.type === 'success' ? (
              <SuccessMsg>{message.text}</SuccessMsg>
            ) : (
              <ErrorMsg>{message.text}</ErrorMsg>
            )
          )}

          <ProjectSelect
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select a project...</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </ProjectSelect>

          {selectedProjectData && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
                  Current members in {selectedProjectData.name}:
                </p>
                <MemberRow>
                  {selectedProjectData.members?.map(m => (
                    <MemberTag key={m._id}>
                      <FaUser style={{ fontSize: '12px' }} /> {m.name}
                    </MemberTag>
                  ))}
                </MemberRow>
              </div>

              <InviteSection>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  Add member by email (they must have registered first):
                </p>
                <InviteForm onSubmit={handleInvite}>
                  <input
                    type="email"
                    placeholder="Member's email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                  <InviteBtn type="submit">
                    <FaUserPlus /> Add
                  </InviteBtn>
                </InviteForm>
              </InviteSection>
            </>
          )}
        </Card>
      </Grid>
    </Container>
  );
};

export default Team;