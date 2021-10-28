
const viewer = document.getElementById('viewer')
const button = document.getElementById('button')
const another = document.getElementById('another')

let emailsMap = new Map()

// on window load place a random image into the viewer
window.onload = () => {
  getImage()
  .then((response) => {
    viewer.innerHTML = `<img src="${response.urls.small}?&h=500&w=700" alt="${response.alt_description}">`
    return response
  })
  .then((response) => {
    addImageToEmail(response)
  })
  // .then((response) => {
  
  // })
  .catch((error) => {
    console.log('There was an error' + error)
    alert('There was an error: ' + error)
  })
}

another.addEventListener('click', () =>{
  getImage()
  .then((response) => {
    viewer.innerHTML = `<img src="${response.urls.small}?&h=500&w=700" alt="${response.alt_description}">`
    return response
  })
  .then((response) => {
    addImageToEmail(response)
  })
  .catch((error) => {
    console.log('There was an error' + error)
    alert('There was an error: ' + error)
  })
})

function addImageToEmail(response){
  return new Promise((resolve, reject) => {
    button.addEventListener('click', () => {
      const email = document.getElementById('email').value
      if(email !=""){  // if something is in the email textarea
        if(emailsMap.has(email)){  // if the email KEY exists
          console.log('first state triggered')
          let imagesArray = new Array()
          imagesArray = emailsMap.get(email)  // retrieve the VALUE array from the map 
          if(imagesArray.indexOf(response.id) === -1){  // if the image id is not already in the imagesArray
            console.log('id does not exist in array')
            imagesArray.unshift(response.id)
            emailsMap.set(email, imagesArray)
            resolve()
          }
        }else{  // the email KEY does not exist
          console.log('second state triggered')
          // email key does not exist add email as the key and add the image url to the beginning of the value array.
          let imagesArray = new Array()
          imagesArray.unshift(response.id)
          emailsMap.set(email, imagesArray)
          resolve()
        }
      }
    })
  })
}

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
      viewer.style.backgroundImage = 'url(\'/assets/img/tvStatic.jpg\')' // not working? try later
    };
    
    xhr.onerror = function() {
      reject(Error(`Request failed: status: ${xhr.status} text`))
    }
  })
}

