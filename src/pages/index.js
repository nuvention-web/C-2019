import React, { Component } from 'react'
import { Link } from "gatsby"
import ReactModal from 'react-modal'

import Layout from "../components/layout"
// import Image from "../components/image"
// import SEO from "../components/seo"

class IndexPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpen: false,
    }
  }
  handleModalOpen = event => {
    // console.log('handleModalOpen: ', event);
    this.setState({ isModalOpen: true })
  }

  handleModalClose = event => {
    // console.log('handleModalOpen: ', event);
    this.setState({ isModalOpen: false })
  }

  render() {
    return (
      <Layout>
        <div id="main">
          <h1>Hi people</h1>
          <p>Welcome to your new Gatsby site.</p>
          <p>Now go build something great.</p>

          <Link to="#" onClick={this.handleModalOpen}>
            Donate Now
          </Link>
        </div>
        <ReactModal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.handleModalClose}
          contentLabel="Example Modal In Gatsby"
        >
          <h2>Donate</h2>
          <button onClick={this.handleModalClose}>Close Modal</button>
        </ReactModal>
      </Layout>
    )
  }
}

ReactModal.setAppElement('#main')

export default IndexPage
