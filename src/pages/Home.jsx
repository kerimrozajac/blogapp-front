import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Image } from "react-bootstrap";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
//import useUserActions from "../hooks/user.actions";
import { getUser } from "../hooks/user.actions";
import { Post } from "../components/posts";
import CreatePost from "../components/posts/CreatePost";
import ProfileCard from "../components/profile/ProfileCard";
import { randomAvatar } from "../utils";
import axios from "axios";
import { useState, useEffect } from 'react';

function Home() {
  //const posts = useSWR("/", fetcher, {
  //  refreshInterval: 20000,
  //});
  //const profiles = useSWR("/users/?limit=5", fetcher);

  const user = getUser();



  if (!user) {
    return <div>Loading!</div>;
  }


  if (user) {
    return (
      <Layout>
        <div>{user.username}</div>
      </Layout>
    );
  }

/*
  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          <Row className="border rounded  align-items-center">
            <Col className="flex-shrink-1">
            <Image
              src={user ? user.avatar : randomAvatar()}
              roundedCircle
              width={52}
              height={52}
              className="my-2"
            />
            </Col>
            <Col sm={10} className="flex-grow-1">
              <CreatePost refresh={posts.mutate} />
            </Col>
          </Row>
          <Row className="my-4">
            {posts.data?.results.map((post, index) => (
              <Post key={index} post={post} refresh={posts.mutate} />
            ))}
          </Row>
        </Col>
        <Col sm={3} className="border rounded py-4 h-50">
          <h4 className="font-weight-bold text-center">Suggested people</h4>
          <div className="d-flex flex-column">
            {profiles.data &&
              profiles.data.results.map((profile, index) => (
                <ProfileCard key={index} user={profile} />
              ))}
          </div>
        </Col>
      </Row>
    </Layout>
  );
  */

}

export default Home;