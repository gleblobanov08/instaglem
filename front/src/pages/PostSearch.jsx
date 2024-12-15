import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LeftItems from "../components/LeftItems";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../data/firebase";
import Post from "../components/Post";

const PostSearch = () => {
    const [currentValue, setCurrentValue] = useState("");
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef);
    
        const unsubscribe = onSnapshot(q, (doc) => {
          const newPosts = doc.docs.map(item => ({
            id: item.id,
            ...item.data()
          }))
          setPosts(newPosts);
        })
    
        return () => unsubscribe();
      }, [])
    
      useEffect(() => {
        const lowercasedSearchTerm = currentValue.toLowerCase();
        const filtered = posts.filter(post => 
          post.text.toLowerCase().includes(lowercasedSearchTerm)
        )
        setFilteredPosts(filtered);
      }, [currentValue, posts])

    return (
        <div className="w-full">
            <div className="fixed top-0 z-10 w-full bg-white">
                <Navbar />
            </div>
            <div className="flex bg-gray-100">
                <div className="flex-auto w-[30%] md:w-[25%] fixed top-12">
                    <LeftItems />
                </div>
                <div className="flex-auto w-[70%] md:w-[75%] absolute left-[30%] md:left-[25%] top-12 bg-gray-100 rounded-xl">
                    <div className="w-[90%] mx-auto">
                        <h1 className="font-roboto font-medium text-xl text-center my-4">Search</h1>
                        <input className="w-full p-2 text-md mt-2 mb-6 rounded-xl border-none outline-none" type="text" name="text" placeholder="Type something..." value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} />
                        {filteredPosts.map((post, index) => (
                            <Post key={index} id={post?.documentId} uid={post?.uid} text={post?.text} image={post?.image} timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostSearch;