
import React from 'react'
import styled from '@emotion/styled'
import Link from 'nextein/link'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default () => {
  return (
    <Header>
      <Main>
      <TransitionGroup className="home-group" component={null}>
        <CSSTransition classNames="brand" timeout={1500} appear in> 
          <Title>NextEPC</Title>
        </CSSTransition>
        <CSSTransition classNames="hello" timeout={750} appear in>
          <Hello>Open Source</Hello>
        </CSSTransition>
      </TransitionGroup>
      </Main>
      <TransitionGroup className="action-group" component={null}>
        <CSSTransition classNames="actions" timeout={2000} appear in>
          <Actions>
            <Link href="/installation" passHref><Button >Installation</Button></Link>
            <Link href="/configuration" passHref><Button >Configuration</Button></Link>
          </Actions>
        </CSSTransition>
        <CSSTransition classNames="actions" timeout={2000} appear in>
          <Actions>
            <Link href="https://nextepc.com" passHref><Secondary inverted>Services & Support</Secondary></Link>
          </Actions>
        </CSSTransition>
      </TransitionGroup>

    </Header>
  )
}

const Header = styled('header')`
  height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  background: #f1f1f1;
  background-image: radial-gradient(circle at center, #fff 0%,  #e9e9e9 100%);
`

const Main = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;

`
const Hello = styled('div')`
  font-size: 1.5em;
  color: #999;
`

const Title = styled('h1')`
  padding: 10px;
  font-weight: 100;
  border-bottom: 4px solid #ff4500;  
`

const Brand = styled('span')`
  font-weight: 400;
`

const Actions = styled('div')`
  width: 100vw;
  display: flex;
  justify-content: center;

`

const Button = styled('a')`
  border: 2px solid #ff4500;
  border-radius: 4px;
  color: #fff;
  background-color: #ff4500;
  
  font-size: .45em;
  font-weight: bold;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: .25em;
  padding: 10px 20px;
  margin: 20px 10px;  
  :hover {
    color: #ff4500;
    background-color: #fafafa;
  }
`

const Secondary = styled(Button)`
  color: #ff4500;
  background-color: #fff;

  :hover {
    color: #ff6500;
    background-color: #eee;
  }
`
