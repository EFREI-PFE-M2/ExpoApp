import { createSlice } from '@reduxjs/toolkit'
import { FirebaseApp as firebase } from '../firebase'
import { FirebaseFirestore as firestore } from '../firebase'
import { addUser } from './foreignUserSlice'
import uploadImage from '../utils/uploadImage'
import { createSelector } from 'reselect'

const PAGINATION = 3

export const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: {},
    specificGroup: {}, //done this way because we can view a group page even if it's not in our group list,
    specificGroupLoading: false,
    specificGroupRecentPostsLoading: false,
    specificGroupNextPostsLoading: false,
    specificGroupNoMorePosts: false,
    specificGroupPostCommentsLoading: false,
    specificGroupPostNoMoreComments: false
  },
  reducers: {
    addGroup: (state, action) => {
      const { id, data } = action.payload
      state.groups[id] = data
    },
    removeGroup: (state, action) => {
      delete state.groups[action.payload]
    },
    updateGroup: (state, action) => {
      const { groupID, name } = action.payload
      state.groups[groupID].name = name
    },
    addAll: (state, action) => {
      action.payload?.forEach((obj) => {
        const { id, ...rest } = obj
        state.groups[id] = rest
      })
    },
    addUsersToGroup: (state, action) => {
      const { users, groupID } = action.payload
      users?.forEach((user) => {
        state.groups[groupID].users[user.uid] = user
      })
    },
    addPostsToGroup: (state, action) => {
      const { posts, groupID } = action.payload
      posts?.forEach((post) => {
        state.groups[groupID].posts[post.id] = post
      })
    },
    addRequestsToGroup: (state, action) => {
      const { requests, groupID } = action.payload
      requests?.forEach((request) => {
        state.groups[groupID].requests[request.id] = request
      })
    },
    removeRequestsFromGroup: (state, action) => {
      const { userID, groupID } = action.payload
      delete state.groups[groupID].requests[userID]
    },
    //-----
    setSpecificGroup: (state, action) => {
      state.specificGroup = action.payload
    },
    setSpecificGroupPosts: (state, action) => {
      state.specificGroup.posts = action.payload
    },
    addSpecificGroupPostToMostRecent: (state, action) => {
      if(state.specificGroup.posts)
        state.specificGroup.posts =  [...action.payload, ...state.specificGroup.posts]
      else
        state.specificGroup.posts =  action.payload
    },
    addSpecificGroupPosts: (state, action) => {
      if(state.specificGroup.posts)
        state.specificGroup.posts =  [...state.specificGroup.posts, ...action.payload]
      else
        state.specificGroup.posts =  action.payload
    },
    setSpecificGroupRecentPostsLoading: (state, action) => {
      state.specificGroupRecentPostsLoading = action.payload
    },
    setSpecificGroupNextPostsLoading: (state, action) => {
      state.specificGroupNextPostsLoading = action.payload
    },
    setSpecificGroupNoMorePosts: (state, action) => {
      state.specificGroupNoMorePosts = action.payload
    },
    setSpecificGroupPostLikeStatus: (state, action) => {
      let { postID, like } = action.payload
      state.specificGroup.posts = state.specificGroup.posts.map((post)=>
      post.id === postID ? {...post, alreadyLiked: like, nbLikes: like ? post.nbLikes+1 : post.nbLikes-1} : post)
    },
    setSpecificGroupPostVoteStatus: (state, action) => {
      let { postID, response } = action.payload
      state.specificGroup.posts = state.specificGroup.posts.map((post)=>
      post.id === postID ? {...post, userVote: response, responses: {...post.responses, [response]: post.responses[response] + 1}} : post)
    },
    setSpecificGroupPostVoteComments: (state, action) => {
      let { comments, postID } = action.payload
      state.specificGroup.posts = state.specificGroup.posts.map((post)=>
      post.id === postID ? {...post, comments: comments} : post)
    },
    setSpecificGroupPostCommentsLoading: (state, action) => {
      state.specificGroupPostCommentsLoading = action.payload
    },
    setSpecificGroupPostNoMoreComments: (state, action) => {
      state.specificGroupPostNoMoreComments = action.payload
    },
    addSpecificGroupPostComment: (state, action) => {
      let { comment, postID } = action.payload
      state.specificGroup.posts = state.specificGroup.posts.map((post)=>
      post.id === postID ? {...post, nbComments: post.nbComments + 1, comments: [...post?.comments, comment]} : post)
    },
  },
})



//actions imports
export const {
  addGroup,
  removeGroup,
  updateGroup,
  addAll,
  addUsersToGroup,
  addPostsToGroup,
  addRequestsToGroup,
  removeRequestsFromGroup,
  setSpecificGroup,
  setSpecificGroupPosts,
  addSpecificGroupPostToMostRecent,
  addSpecificGroupPosts,
  setSpecificGroupRecentPostsLoading,
  setSpecificGroupNextPostsLoading,
  setSpecificGroupNoMorePosts,
  setSpecificGroupPostLikeStatus,
  setSpecificGroupPostVoteStatus,
  setSpecificGroupPostVoteComments,
  setSpecificGroupPostCommentsLoading,
  setSpecificGroupPostNoMoreComments,
  addSpecificGroupPostComment
} = groupSlice.actions

// thunks
export const getGroup = (groupID) => async (dispatch) => {
  try {
    const result = await firestore.collection('Groups').doc(groupID).get()
    let group = result.data()
    delete group.createdAt
    dispatch(addGroup({ id: result.id, data: group }))
  } catch (err) {
    console.error(err)
  }
}

export const getUserGroup = (userID) => async (dispatch) => {
  let groups = []
  try {
    const result = await firestore
      .collectionGroup('GroupMembers')
      .where('uid', '==', userID)
      .get()

    result.forEach(async (doc) => {
      const groupDoc = doc.ref.parent.parent
      groups.push(groupDoc.id)
    })

    const groupPromise = await Promise.all(
      groups.map((groupID) => firestore.collection('Groups').doc(groupID).get())
    )

    const groupData = groupPromise.map((group) => {
      return {
        id: group.id,
        users: {},
        posts: {},
        requests: {},
        currentUserIsMember: true,
        ...group.data(),
      }
    })

    await dispatch(addAll(groupData))
  } catch (err) {
    console.error(err)
  }
}

export const createGroup = (name, isPrivate, photo) => async (
  dispatch,
  getState
) => {
  if (!name) return
  const { user } = getState()
  try {
    const result = await firestore.collection('Groups').add({
      name,
      private: isPrivate,
      nbMembers: 1,
      masterID: user?.uid,
    })

    let res = await result.get()
    let data = res.data()
    delete data.createdAt
    await dispatch(addGroup({ id: result.id, data: data}))
    return result.id
  } catch (err) {
    console.error(err)
  }
  return null
}

export const getMembers = (groupID) => async (dispatch) => {
  if (!groupID) return

  let userArray = []

  try {
    const result = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupMembers')
      .limit(10)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      // dispatch(addUser(doc.id, doc.data()))
      let user = doc.data()
      delete user.createdAt

      userArray.push(user)
    })

    dispatch(addUsersToGroup({ users: userArray, groupID }))
  } catch (err) {
    console.error(err)
  }
}

export const getGroupPosts = (groupID) => async (dispatch) => {
  if (!groupID) return

  let groupPosts = []

  try {
    const result = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupPosts')
      .limit(10)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      let groupPost = doc.data()
      delete groupPost.createdAt
      groupPosts.push({ id: doc.id, ...groupPost})
    })

    dispatch(addPostsToGroup({ posts: groupPosts, groupID }))
  } catch (err) {
    console.error(err)
  }
}

export const getPendingRequests = (groupID) => async (dispatch) => {
  if (!groupID) return

  let groupRequests = []

  try {
    const result = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .limit(10)
      .get()

    if (!result.size) return

    result.forEach((doc) => {
      let joinPendingRequest = doc.data()
      delete joinPendingRequest.createdAt
      groupRequests.push({ id: doc.id, ...joinPendingRequest })
    })

    dispatch(addRequestsToGroup({ requests: groupRequests, groupID }))
  } catch (err) {
    console.error(err)
  }
}

export const acceptRequest = (groupID, requestID) => async (dispatch) => {
  if (!requestID) return

  try {
    const userData = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .doc(requestID)
      .get()

    if (userData.exists) {
      await firestore
        .collection('Groups')
        .doc(groupID)
        .collection('GroupMembers')
        .doc(userData.id)
        .set(userData.data())

      await firestore
        .collection('Groups')
        .doc(groupID)
        .collection('GroupJoinPendingRequests')
        .doc(requestID)
        .delete()
      alert('Requête accepté!')
      dispatch(removeRequestsFromGroup({ userID: userData.id, groupID }))
    }
  } catch (err) {
    console.error(err)
  }
}

export const refuseRequest = (requestID) => async (dispatch) => {
  if (!requestID) return

  try {
    await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .doc(requestID)
      .delete()
    alert('Requête refusé!')
    dispatch(removeRequestsFromGroup({ userID: requestID, groupID }))
  } catch (err) {
    console.error(err)
  }
}

export const requestJoinGroup = (userID, groupID) => async (
  dispatch,
  getState
) => {
  if (!groupID || !userID) return
  const { uid, displayName, photoURL } = getState().user

  try {
    const user = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupMembers')
      .doc(uid)
      .get()

    if (user.exists) throw new Error('User is part of the group.')

    await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupJoinPendingRequests')
      .doc(uid)
      .set({ uid, displayName, photoURL })
  } catch (err) {
    console.error(err)
  }
}

export const deleteGroupRequest = (userID, groupID) => async (dispatch) => {
  if (!userID || !groupID) return

  try {
    const group = await firestore.collection('Groups').doc(groupID).get()

    if (!group.exists || group.data().masterID === userID)
      throw new Error('Operation not allowed.')

    await firestore.collection('Groups').doc(groupID).delete()

    dispatch(removeGroup(groupID))
  } catch (err) {
    console.error(err)
  }
}

export const leaveGroupRequest = (userID, groupID) => async (dispatch) => {
  if (!userID || !groupID) return

  try {
    const group = await firestore
      .collection('Groups')
      .doc(groupID)
      .collection('GroupMembers')
      .doc(userID)
      .get()

    if (!group.exists) return

    await group.ref.delete()

    dispatch(removeGroup(groupID))
  } catch (err) {
    console.error(err)
  }
}

export const updateGroupInfo = (name, groupID) => async (dispatch) => {
  if (!name || !groupID) return

  try {
    await firestore.collection('Groups').doc(groupID).set({ name })

    dispatch(updateGroup({ groupID, name }))
  } catch (err) {
    console.error(err)
  }
}


// ------- specific group post thunks ------- 

export const updateSpecificGroupRecentPosts = (entityID) => async (dispatch, getState) => {
  try {

    let userID = getState().user.uid

    dispatch(setSpecificGroupPosts([]))
    dispatch(setSpecificGroupNoMorePosts(false))
    dispatch(setSpecificGroupRecentPostsLoading(true))

    
    //make query
    const snapshot  = await firestore
      .collection(`Groups/${entityID}/Posts`)
      .orderBy('datetime','desc')
      .limit(PAGINATION)
      .get();

      if (snapshot.empty) {
        console.log('No matching document');
        dispatch(setSpecificGroupRecentPostsLoading(false))
        dispatch(setSpecificGroupNoMorePosts(true))
        return;
      } 
      let posts = []

      for(doc of snapshot.docs) {
        let post = doc.data()
        delete post.createdAt
        post.id = doc.id
        let isAlreadyLiked = await doc.ref.collection('Likes').where('userID', '==', userID).get()
        if(!isAlreadyLiked.empty)
          post.alreadyLiked = true
        else
          post.alreadyLiked = false

        if(post.type === "survey"){
          
          let voteDocs = await doc.ref.collection('Votes').where('userID', '==', userID).get()
          if (!voteDocs.empty) {
            let vote;
            voteDocs.forEach(voteDoc => {
              vote = voteDoc.data()
            });
            post.userVote = vote.response;
          } 
        }

        posts.push(post)
      } 
      
      dispatch(setSpecificGroupPosts(posts))
      
      //hide loading indicator
      dispatch(setSpecificGroupRecentPostsLoading(false))
  } catch (err) {
    alert('Erreur interne')
    console.error(err)
    dispatch(setSpecificGroupRecentPostsLoading(false))
  }
}

export const addSpecificGroupNextPosts = (entityID) => async (dispatch, getState) => {
  try {
    
    let currentPosts = getState().group.specificGroup.posts;

    if(!currentPosts || currentPosts.length < 1)
      return;

    let lastPost = currentPosts[currentPosts.length-1];

    dispatch(setSpecificGroupNextPostsLoading(true))

    const snapshot  = await firestore
      .collection(`Groups/${entityID}/Posts`)
      .orderBy('datetime','desc')
      .startAfter(lastPost.datetime)
      .limit(PAGINATION)
      .get();

      if (snapshot.empty) {
        dispatch(setSpecificGroupNextPostsLoading(false))
        dispatch(setSpecificGroupNoMorePosts(true))
        console.log('No matching documents.');
        return;
      } 

      let posts = []
      snapshot.forEach(doc => {
        let post = doc.data()
        delete post.createdAt
        post.id = doc.id
        posts.push(post)
      });

      dispatch(addSpecificGroupPosts(posts))

      //hide loading indicator
      dispatch(setSpecificGroupNextPostsLoading(false))
  } catch (err) {
    console.error(err)
  }
}

export const newGroupPost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let {user, text, image, survey, bet, entityID} = data;


    let currentDate = new Date()
    
    let post = {
      nbLikes: 0,
      nbComments: 0,
      datetime: currentDate.toISOString(),
      displayName: user.displayName,
      profilePicture: user.photoURL,
      userID: user.uid,
      text: text.trim(), 
    }
    if(image){
      post.type= 'image'
      let imageName = image.substring(image.lastIndexOf('/')+1);
      let milliDate = currentDate.getTime() 
      
      let uploadedUrl = await uploadImage(image, milliDate+imageName, 'posts')//add to firebase storage
      post.image = uploadedUrl

    }else if(survey){
      post.type = 'survey'
      post.expirationDate = new Date(currentDate.getTime() + survey.nbMinutesDuration*60000).toISOString();
      post.responses = survey.responses.filter((res)=>res.length > 1).map((res)=>({[res.trim()]: 0 }))
      .reduce((result, item)=>({...result, ...item}), {})
      post.userVote = null
    }else if(bet){
      post.type= 'bet'
      post.won = null
      post.nbCopiedBets = 0
      post = {...post, ...bet}
    }


    await firestore.collection(`Groups/${entityID}/Posts`).add(post)//insert in firestore

    dispatch(addSpecificGroupPostToMostRecent([post]))//add to local store

    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const likePost = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, like, entityID, userID, postOwnerID } = data
    
    const likePostCloudFunction = firebase.functions('europe-west1').httpsCallable('likePost')
    await likePostCloudFunction({feed: 'group', entityID: entityID,
       postID: postID, userID: userID, like: like, postOwnerID: postOwnerID})
    
    //set local store
    dispatch(setSpecificGroupPostLikeStatus({postID: postID, like: like}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const vote = (data, cbSuccess, cbError) => async (dispatch) => {
  
  try{
    let { postID, entityID, userID, response } = data
    
    const voteCloudFunction = firebase.functions('europe-west1').httpsCallable('vote')
    await voteCloudFunction({feed: 'group', entityID: entityID,
       postID: postID, userID: userID, response: response})
    
    //set local store
    dispatch(setSpecificGroupPostVoteStatus({postID: postID, response: response}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}


export const updateSpecificGroupPostComments = (data) => async (dispatch) => {
  try {

    let { entityID, postID } = data


    dispatch(setSpecificGroupPostVoteComments({comments: [], postID: postID}))
    dispatch(setSpecificGroupPostNoMoreComments(false))
    dispatch(setSpecificGroupPostCommentsLoading(true))
    
    //make query
    const snapshot  = await firestore
      .collection(`Groups/${entityID}/Posts/${postID}/Comments`)
      .orderBy('datetime','asc')
      .get();

      if (snapshot.empty) {
        console.log('No matching document');
        dispatch(setSpecificGroupPostCommentsLoading(false))
        dispatch(setSpecificGroupPostNoMoreComments(true))
        return;
      } 
      let comments = []

      for(doc of snapshot.docs) {
        let comment = doc.data()
        delete comment.createdAt

        comments.push(comment)
      } 
      
      dispatch(setSpecificGroupPostVoteComments({comments: comments, postID: postID}))
      
      //hide loading indicator
      dispatch(setSpecificGroupPostCommentsLoading(false))
  } catch (err) {
    alert('Erreur interne')
    console.error(err)
    dispatch(setSpecificGroupPostCommentsLoading(false))
  }
}


export const comment = (data, cbSuccess, cbError) => async (dispatch, getState) => {
  let currentDate = new Date()
  let currentUser = getState().user
  try{
    let { entityID, postID, text, postOwnerID } = data

    let comment = {
      datetime: currentDate.toISOString(), 
      displayName: currentUser.displayName, 
      picture: currentUser.photoURL, 
      userID: currentUser.uid, 
      text: text
    }
    
    const commentCloudFunction = firebase.functions('europe-west1').httpsCallable('comment')
    await commentCloudFunction({feed: 'group', entityID: entityID, postID: postID, userID: currentUser.uid, datetime: currentDate.toISOString(), 
      displayName: currentUser.displayName, picture: currentUser.photoURL, text: text, postOwnerID: postOwnerID})
    
    //set local store
    dispatch(addSpecificGroupPostComment({comment: comment, postID: postID}))
    cbSuccess()
  }catch(err){
    console.log(err)
    cbError()
  }
}



// selectors
export const selectSpecificGroup = state => state.group.specificGroup

export const selectSpecificGroupPosts = state => state.group.specificGroup.posts

export const selectSpecificGroupPost = postID => {
  return createSelector(
    selectSpecificGroup,
    specificGroup => specificGroup.posts?.find(post => post.id === postID)
  )
}
export const selectSpecificGroupRecentPostsLoading = state => state.group.specificGroupRecentPostsLoading
export const selectSpecificGroupNextPostsLoading = state => state.group.specificGroupNextPostsLoading
export const selectSpecificGroupNoMorePosts = state => state.group.specificGroupNoMorePosts
export const selectSpecificGroupPostCommentsLoading = state => state.group.specificGroupPostCommentsLoading
export const selectSpecificGroupPostNoMoreComments = state => state.group.specificGroupPostNoMoreComments

export const groupReducer = groupSlice.reducer
