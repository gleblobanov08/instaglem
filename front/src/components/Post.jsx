import { useState, useContext, useEffect } from "react"
import { Avatar } from "@mui/material"
import avatar from "../assets/avatar.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment, faTrash, faUserPlus, faLeftLong, faRightLong } from "@fortawesome/free-solid-svg-icons"
import { AuthContext } from "../context/AppContext"
import { doc, collection, query, where, getDocs, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore"
import { db } from "../data/firebase"
import CommentSection from "./CommentSection"
import LikeButton from "./LikeButton"

const Post = ({ uid, id, text, mediaUrls, timestamp }) => {
  const { user, userData } = useContext(AuthContext);
  const [author, setAuthor] = useState({});
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const singlePostDocument = doc(db, "posts", id);

  useEffect(() => {
    const getPostAuthor = async () => {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setAuthor(querySnapshot.docs[0].data());
      }
    }

    getPostAuthor();
  }, [uid])

  const goToPrevious = () => {
    if (mediaUrls && mediaUrls.length > 1) {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? mediaUrls.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    }
  }

  const goToNext = () => {
    if (mediaUrls && mediaUrls.length > 1) {
      const isLastSlide = currentIndex === mediaUrls.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }
  }

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(!open);
  }

  const addUser = async () => {
    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", user?.uid));
      const userDocs = await getDocs(userQuery);
      const userRef = userDocs.docs[0].ref;

      const friendQuery = query(collection(db, "users"), where("uid", "==", uid));
      const friendDoc = await getDocs(friendQuery);
      const friendRef = friendDoc.docs[0].ref;
      const friendData = friendDoc.docs[0].data();

      await updateDoc(userRef, {
        friends: arrayUnion({
          id: friendData.uid,
          image: friendData.photoURL,
          name: friendData.name,
        }),
      })

      await updateDoc(friendRef, {
        friends: arrayUnion({
          id: user?.uid || userData?.uid,
          image: user?.photoURL || userData?.photoURL || "",
          name: user?.name || userData?.name,
        }),
      })
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  }

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        alert("You can't delete other users' posts!");
      }
    } catch (err) {
      alert(err.message);
      console.log(err.message);
    }
  }

  const currentMedia = mediaUrls && mediaUrls.length > 0 ? mediaUrls[currentIndex] : null;
  const isVideo = currentMedia && currentMedia.includes("video");

  return (
    <div className="mb-4">
      <div className="flex flex-col py-4 bg-white rounded-2xl">
        <div className="flex justify-start items-center pb-4 pl-4 ">
          <Avatar className="h-6" variant="circular" src={author.image || author.photoURL || avatar} alt="avatar"></Avatar>
          <div className="flex flex-col ml-4 w-[90%]">
            <p className="py-2 font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
              {author.name}
            </p>
            <p className="font-roboto font-medium text-sm text-gray-700 no-underline tracking-normal leading-none">
              {timestamp}
            </p>
          </div>
          {user?.uid !== uid && (
            <div onClick={addUser} className="flex justify-end cursor-pointer mr-4 sm:mr-10">
              <FontAwesomeIcon className="h-5 sm:h-6" icon={faUserPlus}></FontAwesomeIcon>
            </div>
          )}
        </div>
        <div className="px-4">
          <p className="break-words text-clip ml-3 sm:ml-6 pb-2 sm:pb-4 font-roboto font-medium text-md sm:text-lg text-gray-700 no-underline tracking-normal">
            {text}
          </p>
          {currentMedia && (
            <div className="relative w-full h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center">
                {isVideo ? (
                  <video src={currentMedia} controls className="max-w-full max-h-full object-contain" />
                ) : (
                  <img src={currentMedia || "/placeholder.svg"} alt={`Slide ${currentIndex}`} className="max-w-full max-h-full object-contain" />
                )}
              </div>
              {mediaUrls && mediaUrls.length > 1 && (
                <>
                  <button onClick={goToPrevious} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all">
                    <FontAwesomeIcon icon={faLeftLong} className="h-5 w-5" />
                  </button>
                  <button onClick={goToNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all">
                    <FontAwesomeIcon icon={faRightLong} className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-around items-center pt-4">
          <LikeButton postId={id} />
          <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleOpen}>
            <div className="flex items-center cursor-pointer">
              <FontAwesomeIcon className="h-5 sm:h-6 mr-3 sm:mr-4 text-blue-700" icon={faComment}></FontAwesomeIcon>
              <p className="hidden sm:block font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                Comments
              </p>
            </div>
          </div>
          {user?.uid === uid && (
            <div className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100" onClick={handleDelete}>
              <FontAwesomeIcon className="h-5 sm:h-6 mr-3 sm:mr-4" icon={faTrash}></FontAwesomeIcon>
              <p className="hidden sm:block font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none">
                Delete
              </p>
            </div>
          )}
        </div>
        {open && <CommentSection postId={id}></CommentSection>}
      </div>
    </div>
  )
}

export default Post