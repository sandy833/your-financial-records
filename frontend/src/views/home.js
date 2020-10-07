import React from "react";
import DocumentMeta from "react-document-meta";
import Layout from "../templates";

const Home = (props) => {
  const meta = {
    title: `${process.env.REACT_APP_BRAND} - Your Web Solution`,
    description: `${process.env.REACT_APP_BRAND} is the solution for all your needs`,
    meta: {
      name: {
        robots: "follow,index",
        keywords: "simple, fast, reliable",
      },
    },
  };

  return (
    <DocumentMeta {...meta}>
      <Layout>
        <div className="content">Welcome to the Home Page!</div>
      </Layout>
    </DocumentMeta>
  );
};

export default Home;
