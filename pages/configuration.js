
import React, { Component } from  'react'
import styled from '@emotion/styled'
import Head from 'next/head'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import withPost, { Content } from 'nextein/post'
import { withPostsFilterBy, inCategory } from 'nextein/posts'

import MainNavigation from '../components/navigation'
import Navigation from '../components/configuration/navigation'
import { Main, Section, Side, ArticleTransitionWrapper, Article, Title, Category, Paragraph, CodeBlock } from '../components/elements'
import Code from '../components/code'
import BottomNavigation from '../components/configuration/bottom-navigation'
import Footer from '../components/footer'
import withPageView from '../components/analytics'
import Image from '../components/configuration/image'

const withConfiguration = withPostsFilterBy(inCategory('configuration', { includeSubCategories: true }))

const Config = withPost(withConfiguration( ( { post: current, posts: configuration } ) => {
  const post = current || configuration[0]

  return (
    <Main>
      <Head>
        <title>NextEPC | Configuration | {post.data.title}</title>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css" />
      </Head>

      <MainNavigation showHome title="configuration" styles={{ width: `100vw` }}/>

      <Section>
        <Side>
          <Navigation configuration={configuration} post={post} />
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
              <BottomNavigation configuration={configuration} post={post} />
            </Article>
           </CSSTransition>
          </TransitionGroup> 
      </Section>
      <Footer />
    </Main>
  )
}))

export default withPageView(Config)

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

