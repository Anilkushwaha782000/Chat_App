const socket = io()
//elements
const  messageform=document.querySelector('#message-form')
const messageforminput=messageform.querySelector('input')
const messageformbutton=messageform.querySelector('button')
const location1=document.querySelector('#location')
const msg=document.querySelector('#msg')

//templates
const msgtemplate=document.querySelector('#messagetemplate').innerHTML
const locationmessagetemplate=document.querySelector('#locationmessagetemplate').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options query string
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


//  auto scroll
const autoscroll = () => {
    // New message element
    const $newMessage = msg.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = msg.offsetHeight

    // Height of messages container
    const containerHeight = msg.scrollHeight

    // How far have I scrolled?
    const scrollOffset = msg.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        msg.scrollTop = msg.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(msgtemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm A,YYYY')
    })
    msg.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationmsg',(message)=>{
   console.log(message)
   const html=Mustache.render(locationmessagetemplate,{
       username:message.username,
       url:message.url,
       createdAt:moment(message.createdAt).format('h:mm A, YYYY')
   })
   msg.insertAdjacentHTML('beforeend',html)
   autoscroll()
})


socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    //Disable Form
    messageformbutton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        //enable
        messageformbutton.removeAttribute('disabled')
        messageforminput.value=''
        messageforminput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message Sent')
    })
})

location1.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser!')
    }
    location1.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((GeolocationPosition)=>{
          console.log(GeolocationPosition)
          socket.emit('sendLocation',{
          latitude:GeolocationPosition.coords.latitude,
          longitude:GeolocationPosition.coords.longitude
          },()=>{
           location1.removeAttribute('disabled')
          console.log('Location has been sent! ')
          })
    })
})

socket.emit('join',{username,room},(error)=>{
 if(error){
     alert(error)
     location.href='/'
 }
})