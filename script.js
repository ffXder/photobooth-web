const camera = document.getElementById('camera');
const photoCanvas = document.getElementById('photo');
const statusMessage = document.getElementById('status');
const timer = document.getElementById('timer');
const photoPreview = document.getElementById('photo-preview');
const captureBtn = document.getElementById('capture-btn');
const saveBtn = document.getElementById('save-btn');
const shutterSound = new Audio('assets/shuttersound.mp3');

let stream = null
let photoCount = 0;
const maxPhotos = 3;

async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280},
                height: {ideal: 720},
                facingMode: 'user'
            },
            audio: false
    });
    
    camera.srcObject = stream;
    statusMessage.textContent = 'Camera ready!';
    } catch (error){
        console.error('Error accessing camera:', error);
        statusMessage.textContent = 'Camera access denied';
    }
    console.log('initalize camera'); //check if it works
}

function startCountdown(){
    photoPreview.innerHTML = '';
    photoCount = 0;
    takeNextPhoto();
}

function takeNextPhoto(){
    if (photoCount >= maxPhotos){
        statusMessage.textContent = 'Done!';
        return;
    }

    let countdown = 3;
    timer.textContent = `${countdown}`;
    statusMessage.textContent = `Get ready... ${countdown}`;

    //countdown interval
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0){
            statusMessage.textContent = `Get ready... ${countdown}`;
            timer.textContent = `${countdown}`;
        } else {
            clearInterval(countdownInterval);
            shutterSound.play();
            capturePhoto();
            photoCount++;
            takeNextPhoto();
        }
    }, 1000); //interval time miliseconds
}

//captures photo
function capturePhoto(){
    const context = photoCanvas.getContext('2d');

    photoCanvas.width = camera.videoWidth;
    photoCanvas.height = camera.videoHeight;

    //draws a frame 
    context.save();
    context.scale(-1, 1);
    context.drawImage(camera, -photoCanvas.width, 0, photoCanvas.width, photoCanvas.height);
    context.restore();

    const imgUrl = photoCanvas.toDataURL('image/png');
    addToPreview(imgUrl);

    //shutter effect
    document.body.style.backgroundColor = 'black';
    setTimeout(() => {
        document.body.style.backgroundColor = 'white';
    }, 100);
    
    console.log('this works');
}

//adds to preview
function addToPreview(imgUrl){
    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.width = '200px';
    img.style.height = 'auto';
    img.style.borderRadius = '6px';
    img.style.cursor = 'pointer';

    img.addEventListener('click', () => {
        //create div element
        const preview = document.createElement('div');
        preview.style.position = 'fixed';
        preview.style.top = '0';
        preview.style.left = '0';
        preview.style.width = '100%';
        preview.style.height = '100%';
        preview.style.backgroundColor = 'white';
        preview.style.display = 'flex';
        preview.style.justifyContent = 'center';
        preview.style.alignItems = 'center';
        preview.style.zIndex = '1000';
    
        //create img element
        const previewImg = document.createElement('img');
        previewImg.src = imgUrl;
        previewImg.style.maxWidth = '100%';
        previewImg.style.maxHeight = '100%';
        previewImg.style.borderRadius = '8px';

        preview.appendChild(previewImg);
        document.body.appendChild(preview);

        preview.addEventListener('click', () => {
            document.body.removeChild(preview);
        });
    });

    photoPreview.appendChild(img);
}


document.addEventListener('DOMContentLoaded', function() {
    initCamera();
});

captureBtn.addEventListener('click', startCountdown);
