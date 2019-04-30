
import React, { Component } from  'react'
import styled from '@emotion/styled'
import Head from 'next/head'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import withPost, { Content } from 'nextein/post'
import { withPostsFilterBy, inCategory } from 'nextein/posts'

import MainNavigation from '../components/navigation'
import Navigation from '../components/installation/navigation'
import { Main, Section, Side, ArticleTransitionWrapper, Article, Title, Category, Paragraph, CodeBlock } from '../components/elements'
import Code from '../components/code'
import BottomNavigation from '../components/installation/bottom-navigation'
import Footer from '../components/footer'
import withPageView from '../components/analytics'
import Image from '../components/installation/image'

const withInstallation = withPostsFilterBy(inCategory('installation', { includeSubCategories: true }))

const Install = withPost(withInstallation( ( { post: current, posts: installation } ) => {
  const post = current || installation[0]

  return (
    <Main>
      <Head>
        <title>NextEPC | Installation | {post.data.title}</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css" />
      </Head>

      <MainNavigation showHome title="installation" styles={{ width: `100vw` }}/>

      <Section>
        <Side>
          <Navigation installation={installation} post={post} />
        </Side>
        <TransitionGroup className="fade-transition-group" component={ArticleTransitionWrapper}>
          <CSSTransition key={post.data.url} classNames="fade-transition" timeout={500}>
            <Article>
              <Category>{post.data.category}</Category>
              <Title>{post.data.title}</Title>
              <Content
                {...post}
                renderers={{
                  h2: BlogSection,
                  blockquote: Blockquote,
                  code: Code,
                  p: Paragraph,
                  pre: CodeBlock,
                  img: Image
                }}
              />
              <BottomNavigation installation={installation} post={post} />
            </Article>
           </CSSTransition>
          </TransitionGroup> 
      </Section>
      <Footer />
    </Main>
  )
}))

export default withPageView(Install)

const Blockquote = styled('blockquote')`
  margin: 1em 0;
  padding: 1.5em;
  padding-left: 1.25em;
  border-left: 5px solid; 
  background: #e4e4e4;
  & > p {
    margin: 0;
  }
`

const BlogSection = styled('h2')`
  margin: 1em 0;
  margin-left: -0.25em;
  color: rgba(0,0,0, .8);
`

