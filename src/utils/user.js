const users=[]
// addUser,removeUser,getUser,getUserInRoom

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //valiadte the data
    if(!username||!room){
        return{
            error:'Username and Roomname is required!'
        }
    }
    //check for existing users
    const existinguser=users.find((user) => {
     return user.room==room && user.username===username
    })

    //validate username

    if(existinguser){
        return{
            error:'Username is already in use'
        }
    }

    //store user

    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUser=(id)=>{
   const index=users.findIndex((user)=>user.id===id)
   if(index!==-1){
     return users.splice(index,1)[0]
   }
}


const getUserInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}



const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}
module.exports={
    addUser,
    getUser,
    removeUser,
    getUserInRoom
}