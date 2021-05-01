import React, { Component } from 'react';

import { API_URL } from 'util/constants';

import Image from '../../../components/Image/Image';
import './SinglePost.css';
import { getAuthHeader } from '../../../util/fetch';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: '',
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    fetch(`${API_URL}/feed/posts/${postId}`, { headers: getAuthHeader() })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then((resData) => {
        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          image: resData.post.imageUrl.includes('http')
            ? resData.post.imageUrl
            : `${API_URL}/${resData.post.imageUrl}`,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          content: resData.post.content,
        });
      })
      .catch(console.log);
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
