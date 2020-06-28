let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);
let renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setSize(window.innerWidth,window.innerHeight);
$('body').append(renderer.domElement);

let geometry = new THREE.BoxGeometry(1,3,1);
let material = new THREE.MeshBasicMaterial({color:'white'});
let cube= new THREE.Mesh(geometry,material);
scene.add(cube);

cube.position.z = -5;
cube.rotation.x = 10;
cube.rotation.y = 5;
	renderer.render(scene,camera);

function update(){
	requestAnimationFrame(update);
	renderer.render(scene,camera);
	cube.rotation.z -= 0.1;
}
update();
