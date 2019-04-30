import React from 'react'
import styled from '@emotion/styled'
import Link from 'nextein/link'

import Github from './icons/github'
import Gitter from './icons/gitter'
import Npm from './icons/npm'

export default () => {
  return (
    <Footer>
      <Grid>
        <Brand>
          NextEPC
          <Notice>Copyright &copy; { new Date().getFullYear() } NextEPC Inc.</Notice>
        </Brand>
        <SiteMap>
          <Link href="/"><a>HOME</a></Link>
          <Link href="/installation"><a>INSTALLATION</a></Link>
          <Link href="/configuration"><a>CONFIGURATION</a></Link>
        </SiteMap>
        <Social>
          <a href="https://github.com/nextepc" target="_blank"><Github fill="#564949" width="24" alt="Github"/></a>
        </Social>
      </Grid>
      <BuiltWithLove />
    </Footer>
  )
}

const BuiltWithLove = () => (
  <Built>
    Built with <span>♥︎</span> and <span>nextein</span> by <a href="https://github.com/elmasse">/<span>elmasse</span></a>
  </Built>
)

const Footer = styled('footer')`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #131010;
  min-height: 250px;
`

const Grid = styled('div')`
  display: flex;
  flex: 1;
  padding: 32px;
`
const SiteMap = styled('div')`
  flex: 2;
  padding: 1em 0;
  border-top: 1px solid #564949;
  & a {
    font-size: .8em;
    display: block;
    text-decoration: none;
    padding: 2px 0;
  }
  & a:hover {
    color: #ff4500;
  }
`

const Brand = styled('div')`
  color: #ff4500;
  font-size: 1.5em;
  margin-right: 2em;
`

const Notice = styled('div')`
  font-size: .3em;
  color: #f1f1f1;
  text-transform: uppercase;
  letter-spacing: .06em;
  padding-top: 12px;
`

const Social = styled('div')`
  flex: 1;
  padding: 1em 0;
  border-top: 1px solid #ff4500;
  font-weight: 300;
  color: #ff4500;
  display: flex;
  align-items: center;
  align-self: baseline;
  justify-content: flex-end;
  & a {
    padding: 5px;
  }

  & a:hover svg {
    fill: #9a8888;
  }
`

const Built = styled('div')`
  

  padding: 16px 0;
  align-self: stretch;
  text-align: center;

  font-size: .75em;

  &, a, a:visited, a:hover {
    color: #f1f1f1;
    text-decoration: none;
  }

  span {
    font-weight: 600;
    color: #ff4500;    
  }
`
