import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Image } from "react-bootstrap";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
//import useUserActions from "../hooks/user.actions";
import { getUser } from "../hooks/user.actions";
import Post from "../components/posts/Post";
import CreatePost from "../components/posts/CreatePost";
import ProfileCard from "../components/profile/ProfileCard";
import { randomAvatar } from "../utils";
import axios from "axios";
import { useState, useEffect } from 'react';
import { useUserActions } from "../hooks/user.actions";
import axiosService from "../helpers/axios";

function Home() {

  // Ukoliko vec nema authorizacijski token, uzima Token iz local storagea i stavlja u header
  if(!axiosService.defaults.headers.common['Authorization'])
  {
    const retrievedToken = localStorage.getItem('authToken');
    axiosService.defaults.headers.common['Authorization'] = `Token ${retrievedToken}`;
  }

  // pozivanje liste postova
  const { data: posts, mutate: mutatePosts } = useSWR("/", fetcher, {
    refreshInterval: 20000,
  });

  // pozivanje profila
  const profiles = useSWR("/users/?limit=5", fetcher);



  //definisanje userActions
  const [error, setError] = useState(null);
  const userActions = useUserActions();

  // pozivanje usera
  const user = userActions.fetchUser().catch((err) => {
    if (err.message) {
      setError(err.request.response);
    }
  });
  

  //const user = getUser();
  //console.log('User Object:', user);




  if (!user || !posts) {
    return <div>Loading!</div>;
  }



  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          {/* Create Post Component */}
          <CreatePost refresh={mutatePosts} />

          {/* Display Posts */}
          {posts.results && posts.results.length > 0 ? (
            posts.results.map((post) => (
              <Post key={post.public_id} post={post} refresh={mutatePosts} />
            ))
          ) : (
            <div>No posts available</div>
          )}
        </Col>
        <Col sm={3} className="border rounded py-4 h-50">
          {/* Display profiles */}
          {/* Add your logic to display profiles here */}
        </Col>
      </Row>
    </Layout>
  );
}



export default Home;