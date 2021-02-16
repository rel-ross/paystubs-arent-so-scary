console.log("here!")
const $enterButton = document.querySelector(".enter-button")
const $companySideBar = document.querySelector(".company-sidebar")
const $search = document.querySelector("#search")
const $navBar = document.querySelector("#navbar")
const $uploaderBox = document.querySelector('#uploader-drop-box')
const $progress = document.querySelector('#progress')
const $uploaderContent = document.querySelector('#uploader-content')
const $documentDisplay = document.querySelector('#document-display')
const $seeFileButton = document.querySelector('#see-file')

$enterButton.addEventListener("click", removeSplash)
$search.addEventListener("click", searchBarAppear)

// $uploaderBox.addEventListener("drop", uploadFile)

function removeSplash(event) {
    console.log($companySideBar)
    $companySideBar.style.width = "200px"
    $companySideBar.style.transition = "0.5s";
    $enterButton.style.visibility = "hidden"
}

function searchBarAppear(event) {
    console.log("opening search bar")
    $search.textContent = ""
    const $searchBarForm = document.createElement("form")
    $searchBarForm.setAttribute("id", "search-form")
    $searchBarForm.innerHTML = `
        <input
        class="search-input"
        type="text"
        name="search-text"
        placeholder="🔍 Search..."
        />
    `
    $navBar.append($searchBarForm)
}

function uploadFile(event) {
    console.log(document.getElementById('uploader-drop-box').files[0])
    $uploaderBox.style.visibility="hidden"
    $loader.style.visibility ="visible"
}

// upload file to firebase functionality
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCVpdp_zJD6hFhb1WkTgOrE4IsShhDRAyQ",
    authDomain: "paystub-literacy.firebaseapp.com",
    projectId: "paystub-literacy",
    databaseURL: "https://paystub-literacy-default-rtdb.firebaseio.com/",
    storageBucket: "paystub-literacy.appspot.com",
    messagingSenderId: "1001559770152",
    appId: "1:1001559770152:web:45e63caad1566ae98fa11d",
    measurementId: "G-PPETCFSEGX"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage()
var storageRef = storage.ref();


var files = [];
document.getElementById("files").addEventListener("change", function(e) {
  files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
  }
});

document.getElementById("send").addEventListener("click", function() {
    //checks if files are selected
    if (files.length != 0) {

    //Loops through all the selected files
    for (let i = 0; i < files.length; i++) {

      //create a storage reference
      var storage = firebase.storage().ref(files[i].name);

      //upload file
      var upload = storage.put(files[i]);

      //update progress bar
      upload.on(
        "state_changed",
        function progress(snapshot) {
          var percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          document.getElementById("progress").value = percentage;
        },

        function error() {
          alert("error uploading file");
        },

        function complete() {
          document.getElementById(
            "uploading"
          ).innerHTML += `
            ${files[i].name} uploaded <br />
            `;
            $seeFileButton.style.visibility = "visible"
            $seeFileButton.textContent ="See File"

          var filesRef = storageRef.child('files');
          var uploadedFile = filesRef.child(files[i].name)
          console.log(`made it to 103- ${uploadedFile}`)
          getFileUrl(uploadedFile)
        //   uploadedFile.getDownloadURL()
    //         .then(fireBaseUrl => {
    //             console.log(`this is the URL ${fireBaseUrl}`)
    // //     do a fetch, post to the Rails backend and give the url by way of fireBaseURL)
    //             fetch('http://localhost:3000/pages',  {
    //                 method: "POST",
    //                 //this is where we tell the backend what we're sending over
    //                 headers: {
    //                     "Content-type": "application/json"
    //                 },
    //                 body: JSON.stringify({
    //                     page: { url: fireBaseURL }
    //                 })
                
    //             })
    //         })
        }
      );
    }
    } else {
    alert("No file chosen");
    }
    $seeFileButton.addEventListener('click', showParsedPDF)
    });


function getFileUrl(file) {
  //create a storage reference
  var storageRef = firebase.storage().ref(file.name);

  //get file url
  storageRef
    .getDownloadURL()
    .then(function(url) {
      storeFiletoBackend(url)
    })
    .catch(function(error) {
      console.log("error encountered");
    });
}

function storeFiletoBackend(URL) {
    console.log("this is the URL", URL)
    fetch('http://localhost:3000/pages',  {
        method: "POST",
        //this is where we tell the backend what we're sending over
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            page: { url: URL }
        })
    })
}

function showParsedPDF(event) {
    let fileContent = "";
    $documentDisplay.style.visibility="visible"
    fetch("http://localhost:3000/pages/1")
        .then(response => response.json())
        .then(file => {
            fileContent = file.content
            let splitFile = fileContent.split(/\r?\n/)
            splitFile.splice("", 'Test')
            let filteredFileArray = splitFile.filter(word => word != false)
            filteredFileArray.map(arrayItem => {
                $row = document.createElement("tr")
                rowArray = arrayItem.split("                    ")
                let noBlanksRowArray = rowArray.filter(element => element.length > 0)
                noBlanksRowArray.map(element => {
                    console.log("element and length", element, element.length)
                        $cell = document.createElement("td")
                        $cell.textContent = element.trim()
                        return $cell

                }).map($cell => {
                    $row.append($cell)
                    return $row
                }).forEach ($row => {
                    $documentDisplay.append($row)
                })
            })
        })

}