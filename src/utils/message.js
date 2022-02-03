const generatemsg=(username,text)=>{
    return{
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const generatelocationmsg=(username,url)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}


module.exports={
    generatemsg,
    generatelocationmsg
}