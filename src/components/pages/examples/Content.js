import React from 'react'
import { Box, Flex, Heading} from 'serverless-design-system'

import { AppContainerNew as AppContainer }  from 'src/components'
import Search from './Search'
import ExamplePreview from './SingleExamplePreview'
import algoliasearch from 'algoliasearch/lite'

const client = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY) 
const examplesIndex = client.initIndex(process.env.GATSBY_ALGOLIA_EXAMPLES_INDEX)

//TODO - dynamic generation of examplesList pages
const selectedProps = {
  //platform: 'AWS',
  //language: 'nodeJS'
} 

const paginationLimit = 15

export default class Content extends React.Component {

  constructor (props){
      super(props)
      this.state = {
        examples: this.props.examples,
        initState: true,
        noMoreResults: false,
        isLoading: false,
        filter: {},
        pageNum: 0
      }
  }

  componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false)
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1500)) {

      if(this.state.isLoading || this.state.noMoreResults) {
        return
      } else {
        this.setState({isLoading: true})

        if(this.state.initState) {
          this.addResults({filters: 'NOT highlighted:true'})
        } else {
          const currentFilters = this.makeFilterQuery(this.state.filter)
          this.addResults(currentFilters)
        }
      }
    }
  }

  parseExamplesFromAlgolia = (content) => {
    const examples = content.hits.map((hit) => {
      return {
        id: hit.objectID,
        frontmatter: {
          title: hit.title,
          description: hit.description,
          language: hit.language,
          platform: hit.platform
        }
      }
    })

    return examples
  }

  //triggered when user searches for something new or filters something
  handleRefreshResults = (filter) => {
    this.setState({filter: filter, initState: false, noMoreResults: false, isLoading: false, pageNum: 0})
    const searchObj = this.makeFilterQuery(filter)
    searchObj.hitsPerPage = paginationLimit
    searchObj.page = 0
    this.setState({pageNum: 1})
    this.refreshResults(searchObj)
  }

  refreshResults = (searchObj) => {
    examplesIndex.search(searchObj, (err, content) => {
      if(err) console.error(err)
      const examples = this.parseExamplesFromAlgolia(content)
      this.setState({
        examples
      })
    })
  }

  makeFilterQuery = (filter) => {
    const searchQuery = filter.search

    let filtersQuery = ""
    Object.keys(filter).map((key) => {
       //skipping 'search' key since algolia has query parameter specifically for search text, deleting it before forming filterQuery
        if(filter[key] && key !== 'search') {
          if(filtersQuery) {
            filtersQuery += ' AND '
          }

          filtersQuery += `${key}:"${filter[key]}"`
        }
    })

    let searchObj = {}
    if(searchQuery) {
      searchObj.query = searchQuery
    }

    if(filtersQuery) {
      searchObj.filters = filtersQuery
    }
    
    return searchObj
  }

  //used for pagination
  addResults = (searchObj) => {
    const currentPageNum = this.state.pageNum
    
    searchObj.hitsPerPage = paginationLimit
    searchObj.page = currentPageNum
    examplesIndex.search(searchObj, (err, content) => {
      if(err) console.error(err)
      const nextPageNum = currentPageNum + 1
      this.setState({pageNum: nextPageNum, isLoading: false})

      const examples = this.parseExamplesFromAlgolia(content)
      if(examples.length < paginationLimit) {
        this.setState({noMoreResults: true})
      }

      const allExamples = this.state.examples.concat(examples)
      this.setState({examples: allExamples})
    })
  }

  render() {
    return (
      <AppContainer>
      
      <Box
        pb={[300, 300, 12, 12]}
      >
      
        <Box
          mt={[6, 6, '161px']}
          color='black'
        >
          <Heading.h3
              fontSize={[4, 4, 6]}
              fontFamily='Soleil'
              letterSpacing={['-0.4px', '-0.4px', 0]}
              lineHeight={[1.33, 1.33, 1.25]}
              align='center'
              >
            All the examples
          </Heading.h3>
        </Box>

        <Search refreshResults={this.handleRefreshResults} selectedOptions={selectedProps}/>

        <Flex
          flexDirection={['column', 'column', 'row']}
          flexWrap='wrap'
          justifyContent='left'
          mb={[200, 200, 280]}
        >
          
            { this.state.examples.map((example, index) => (<ExamplePreview key={`example-${index}`} {...example} />)) }
        </Flex>
      </Box>
    </AppContainer>
    )
  }
}
