
import React from 'react'
import styled, { css } from 'react-emotion'
import { inCategory } from 'nextein/posts'
import Link from 'nextein/link'

export default ({ docs, post }) => {
  const nextepc = docs.filter(inCategory('docs/nextepc'))
  const _package = docs.filter(inCategory('docs/package'))
  const build = docs.filter(inCategory('docs/build'))
  const tutorial = docs.filter(inCategory('docs/tutorial'))
  return (
    <Nav>
      {nextepc.length && <Separator>NextEPC</Separator>}
      {
        nextepc.map((doc, idx) => {
          const { data } = doc
          const active = post.data.url === data.url
          return (
            <Link key={`doc-nav-${idx}`} { ...doc }><Item className={active ? 'active': ''}>{data.title}</Item></Link>
          )
        })
      }
      {_package.length && <Separator>Package</Separator>}
      {
        _package.map((doc, idx) => {
          const { data } = doc
          const active = post.data.url === data.url
          return (
            <Link key={`doc-nav-${idx}`} { ...doc }><Item className={active ? 'active': ''}>{data.title}</Item></Link>
          )
        })
      }
      {build.length && <Separator>Build</Separator>}
      {
        build.map((doc, idx) => {
          const { data } = doc
          const active = post.data.url === data.url
          return (
            <Link key={`doc-nav-${idx}`} { ...doc }><Item className={active ? 'active': ''}>{data.title}</Item></Link>
          )
        })
      }
      {tutorial.length && <Separator>Tutorial</Separator>}
      {
        tutorial.map((doc, idx) => {
          const { data } = doc
          const active = post.data.url === data.url
          return (
            <Link key={`doc-nav-${idx}`} { ...doc }><Item className={active ? 'active': ''}>{data.title}</Item></Link>
          )
        })
      }
    </Nav>
  )
}

const Nav = styled('nav')`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: stretch;
`

const Separator = styled('div')`
  margin: .5em 0;
  padding: .5em 1em;
  border-left: 5px solid transparent;
  flex: 1;
  font-size: .75em;
  font-weight: 600;
  color: #212121;
  text-transform: uppercase;
  border-bottom: 1px solid #ccc;
`

const Item = styled('a')`
  padding: 1em;
  text-decoration: none;
  color: #212121;
  border-left: .5em solid transparent;
  flex: 1;
  
  &:hover {
    color: #181818;
    background-color: #f4f4f4;
    border-left: .5em solid #ccc;
  }
  
  &.active,
  &.active:hover {
    color: #212121;
    background-color: #fafafa;
    border-left: .5em solid #f63;    
  }
`
