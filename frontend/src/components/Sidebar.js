import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaProjectDiagram, FaTasks, FaUsers, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SidebarContainer = styled.aside`
  width: 260px;
  min-height: 100vh;
  background: #093c5d;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
`;

const Logo = styled.div`
  color: white;
  font-size: 22px;
  font-weight: 700;
  padding: 0 20px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;

  span {
    color: #75df8d;
  }
`;

const Nav = styled.nav`
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  transition: all 0.3s;
  text-decoration: none;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    color: white;
    background: rgba(117, 223, 141, 0.2);
    border-left: 4px solid #75df8d;
  }

  svg {
    font-size: 18px;
    width: 20px;
  }
`;

const UserSection = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  color: white;
  margin-bottom: 15px;

  h4 {
    font-size: 14px;
    margin-bottom: 3px;
  }

  p {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  width: 100%;
  padding: 12px;
  transition: color 0.3s;

  &:hover {
    color: #ff6b6b;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 200;
  background: #093c5d;
  color: white;
  padding: 10px;
  border-radius: 8px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    opacity: ${props => props.$isOpen ? 1 : 0};
    pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
    transition: opacity 0.3s;
  }
`;

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <MobileToggle>
        <FaBars />
      </MobileToggle>
      <Overlay />
      <SidebarContainer>
        <Logo>
          Team<span>Task</span>
        </Logo>
        <Nav>
          <NavItem to="/" end>
            <FaHome /> Dashboard
          </NavItem>
          <NavItem to="/projects">
            <FaProjectDiagram /> Projects
          </NavItem>
          <NavItem to="/tasks">
            <FaTasks /> Tasks
          </NavItem>
          <NavItem to="/team">
            <FaUsers /> Team
          </NavItem>
        </Nav>
        <UserSection>
          <UserInfo>
            <h4>{user?.name}</h4>
            <p>{user?.role}</p>
          </UserInfo>
          <LogoutBtn onClick={logout}>
            <FaSignOutAlt /> Logout
          </LogoutBtn>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;