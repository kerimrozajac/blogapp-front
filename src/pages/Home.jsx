import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Image } from "react-bootstrap";
import { randomAvatar } from "../utils";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import useUserActions from "../hooks/user.actions";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { format } from "timeago.js"; 
import { LikeFilled, CommentOutlined, LikeOutlined, MoreOutlined } from "@ant-design/icons";


function Home() {
  const { getUser } = useUserActions();
  const user = getUser();

  const posts = useSWR("api/v1/", fetcher, {
    refreshInterval: 10000,
  });

//  if (!user) {
//    return <div>Loading!</div>;
//  }

  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          <Row className="border rounded align-items-center">
            <Col className="flex-shrink-1">
              <Image
                src={randomAvatar()}
                roundedCircle
                width={52}
                height={52}
                className="my-2"
              />
            </Col>
            <Col sm={10} className="flex-grow-1">
              <CreatePost />
            </Col>
          </Row>
          <Row className="my-4">
            {posts.data?.results.map((post) => (
              <Post key={post.id} post={post} refresh={posts.mutate} />
            ))}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;
