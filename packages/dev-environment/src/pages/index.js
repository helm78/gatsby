import { buildFluidImageData } from "@imgix/gatsby-transform-url"
import { Link } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import Image from "../components/image"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <Img
        fluid={{
          ...buildFluidImageData("https://assets.imgix.net/examples/pione.jpg"),
          sizes: "50vw",
          aspectRatio: 3,
        }}
      />
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link> <br />
      <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    </Layout>
  )
}

export default IndexPage
