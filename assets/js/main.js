
const viewer = document.getElementById('viewer')
const button = document.getElementById('button')
const another = document.getElementById('another')
const showcase = document.getElementById('showcase')
const tvMessage = document.getElementById('tv-message')
const attribution = document.getElementById('attribution')

let emailsMap = new Map()
let currentResponse

// START listeners
window.onload = () => {  // on page load
  getImage()  // get a new image
  .then((response) => {  // populate the viewer with the image
    viewer.innerHTML = `<img src="${response.urls.small}?&h=400&w=575" alt="${response.alt_description}">`
    attribution.innerHTML = `<span>Photo taken by <a href="${response.user.links.html}?utm_source=netmatters%20task&utm_medium=referral" target="_blank">${response.user.name}</a></span>`
    currentResponse = response  // to pass the response to functions like addImageToEmail
  })
  .catch((error) => {
    console.log('There was an error' + error)
    error = "Error 403"? tvMessage.innerHTML = '<span>Run out of image requests, sorry. Try again soon</span>' : '<span>Sorry, the programme ran into an error. Developers should check the console log for error messages.</span>'
  })
}

another.addEventListener('click', () =>{  // when a user clicks the "give me another image" button
  getImage()  // get another image
  .then((response) => {  // populate the viewer with the new image
    viewer.innerHTML = `<img src="${response.urls.small}?&h=400&w=575" alt="${response.alt_description}">`
    attribution.innerHTML = `<span>This photo was taken by <a href="${response.user.links.html}?utm_source=netmatters%20task&utm_medium=referral" target="_blank">${response.user.name}</a></span>`
    currentResponse = response  // to pass the response to functions like addImageToEmail
  })
  .then(() => {
    tvMessage.innerHTML = "";
  })
  .catch((error) => {
    console.log('There was an error' + error)
    error = "Error 403"? tvMessage.innerHTML = '<span>Run out of image requests, sorry. Try again soon</span>' : '<span>Sorry, the programme ran into an error. Developers should check the console log for error messages.</span>'
  })
})


button.addEventListener('click', () => {  // when a user clicks the "send it to me" button
  const email = document.getElementById('email').value
  if(validateEmail(email)){
    addImageToEmail(currentResponse, email)
  }
  displayCollection()
})

// END listeners

//START functions

function validateEmail(email){
  const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  if(!regex.test(email)){
    tvMessage.style.display = "inline-flex";
    tvMessage.innerHTML = "The email address you supplied is not a valid email address. Please check your entry.\n";
  }else{
    tvMessage.innerHTML = "";
    tvMessage.style.display = "none";
    return true
  }
}

function addImageToEmail(response, email){
  if(email !=""){  // if something is in the email textarea
    if(emailsMap.has(email)){  // if the email KEY exists
      let imagesArray = new Array()
      imagesArray = emailsMap.get(email)  // retrieve the VALUE array from the map 
      if(imagesArray.indexOf(response.urls.thumb) === -1){  // if the image id is not already in the imagesArray
        imagesArray.unshift(response.urls.thumb)  // add the image id to the beginning of the array
        emailsMap.set(email, imagesArray)  // add the image array as the VALUE onto the associated email KEY
      }
    }else{  // the email KEY does not exist
      let imagesArray = new Array()
      imagesArray.unshift(response.urls.thumb)  // add the image id to the beginning of the image array
      emailsMap.set(email, imagesArray)  // create a new map entry with the email KEY and add the image array as the VALUE
    }
  }
}


function displayCollection(){
  let output = ""  // setup a discard variable for use as a concatenation tool for output
  const tempArray = Array.from(emailsMap.keys());  // make a temp array from the map keys so we can reverse it
  const sizeAffix = "?&h=100&w=300"
  tempArray.reverse();
  for(let key of tempArray){  // loop through emails in reverse order (most recent first)
    const urls = emailsMap.get(key)  // get the array of urls stored as the VALUE in the emailsMap for this email
    output += `<h2 class="email-tag">${key}</h2><br>`   // start to build the output string by adding the email (once!)
    for(let src of urls){         // loop through each url
      output += `<img src="${src}${sizeAffix}" class="thumb" alt="thumbnail preview">`    // add it to the image tag
    }
  }
  showcase.innerHTML = output   // add the concatenated output to the inside of the showcase div 
}
// END functions

// START promises

function getImage(){
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.unsplash.com/photos/random/?client_id=xmXDFa4zDCVL-ApnvXeJsUnhSivURuIZaTxuCZj-yHo')
    xhr.setRequestHeader('Accept-Version', 'v1')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.responseType = 'json'
    xhr.send()
    
    // after the response is received
    xhr.onload = function() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        viewer.style.backgroundImage = 'none';
        console.log(xhr.response)
        resolve(xhr.response)
      } else {
        reject(Error(`Error ${xhr.status}: ${xhr.statusText}`))
      }
    };
    
    xhr.onprogress = function(event) {
      viewer.style.backgroundImage = "url('../img/tvStatic.jpg')" // not working? try later
    };
    
    xhr.onerror = function() {
      reject(Error(`Request failed: status: ${xhr.status} text`))
    }
  })
}

// END promises