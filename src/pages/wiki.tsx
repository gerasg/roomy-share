import { useRouter } from 'next/router';
import { Badge, Accordion, Card as BootstrapCard } from 'react-bootstrap';
import { HouseFill, InfoCircle, BoxArrowInRight, ChevronDown, ChevronUp, UsbSymbol, Power, Tools, Bucket, HouseDoorFill, ClockFill, VolumeMute } from 'react-bootstrap-icons';

import styled from 'styled-components';
import { useEffect, useState } from 'react';

const useAccordionToggle = (defaultActiveKey = '') => {
    const [activeKey, setActiveKey] = useState(defaultActiveKey);
  
    const onToggle = (key, e) => {
      setActiveKey(key !== activeKey ? key : null);
    };
  
    return [activeKey, onToggle];
  };

const AccordionToggleIcon = styled(({ isOpen, ...props }) => isOpen ? <ChevronUp {...props} /> : <ChevronDown {...props} />)`
  color: #FFFFFF;
  margin-left: auto;
`;

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #18191F;
  color: #FFFFFF;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SideNav = styled.div`
  flex: 0 0 24px;
  background: #212431;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    flex: 0 0 auto;
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: #FFFFFF;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  gap: 1rem;
  transition: 0.3s ease-in-out;

  &:hover {
    color: #1ABC9C;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 0;
  }
`;

const Card = styled.div`
  background: #2C2F47;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: #FFFFFF;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); // Adding box-shadow for modern shadow effect.
  transition: transform 0.2s, box-shadow 0.2s; // Adding transition for smooth transform effect.

  &:hover {
    transform: scale(1.01); // Card grows a bit on hover.
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.19), 0 8px 8px rgba(0, 0, 0, 0.23); // Bigger shadow on hover.
  }

  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const Button = styled.button`
  background: #1ABC9C;
  border: none;
  padding: 0.75rem 1.5rem;
  color: #FFFFFF;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    background: #16A085;
  }
`;

const StyledAccordionHeader = styled(Accordion.Header)`
  && button {
    cursor: pointer;
    color: #FFFFFF;
    background-color: #2C2F47;
    width: 100%;
    justify-content: space-between;

    &:hover {
      color: #1ABC9C;
    }

    &::after {
      display: none !important;
    }
  }
`;

const StyledAccordionBody = styled(Accordion.Body)`
  && {
    color: #1ABC9C;
    background-color: #18191F;
  }
`;

const StyledBootstrapCard = styled(BootstrapCard)`
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`;



export default function Wiki() {
    const router = useRouter();
    const handleLogout = (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      router.push('/login');
    }
    const [activeKey, onToggle] = useAccordionToggle('0');
  
    return (
        <DashboardWrapper>
          <SideNav>
            <NavItem href="/"><HouseFill />Home</NavItem>
            <NavItem href="/wiki"><InfoCircle />Wiki</NavItem>
            <NavItem href="/" onClick={handleLogout}><BoxArrowInRight />Logout</NavItem>
          </SideNav>
          <MainContent>
            <h2>Wiki</h2>
            <Accordion defaultActiveKey="0" activeKey={activeKey} onSelect={onToggle}>
                <StyledBootstrapCard>
                    <Accordion.Item eventKey="0">
                    <StyledAccordionHeader>
                        Accordion 1
                        <AccordionToggleIcon isOpen={activeKey === '0'} />
                    </StyledAccordionHeader>
                    <StyledAccordionBody>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </StyledAccordionBody>
                    </Accordion.Item>
                </StyledBootstrapCard>
                <StyledBootstrapCard>
                    <Accordion.Item eventKey="1">
                    <StyledAccordionHeader>
                        Accordion 2
                        <AccordionToggleIcon isOpen={activeKey === '1'} />
                    </StyledAccordionHeader>
                    <Accordion.Body>
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Accordion.Body>
                    </Accordion.Item>
                </StyledBootstrapCard>
            </Accordion>
          </MainContent>
        </DashboardWrapper>
    );
  }
