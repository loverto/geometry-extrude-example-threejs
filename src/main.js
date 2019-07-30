import * as THREE from 'three';
import './BaseUtils'
import * as dat from 'dat.gui';
import OrbitControls from './OrbitControls';
import {extrudeGeoJSON} from 'geometry-extrude';
import * as turf from '@turf/turf'
import FlyLines from './FlyLines'

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#viewport').appendChild(renderer.domElement);

function init(json) {
    const scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial();

    var line = turf.featureCollection(json.features);

    var flyline = [];

    var chunk = turf.lineChunk(line, 1000, {units: 'miles'});

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '0x';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    chunk.features.slice(0,4).forEach(function (ff) {

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.MeshStandardMaterial({color: parseInt(getRandomColor(),16)});

        var gg = {}
        gg.features = [ff];

        const {polyline} = extrudeGeoJSON(gg, {
            depth: 2,
            lineWidth: 0.5,
            bevelSize: 0.05,
            fitRect: {
                x: 0,
                y: 0,
                width: 100
            }
        });
        const {position, normal, indices} = polyline;
        debugger
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
        geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
        geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));

        const mesh = new THREE.Mesh(geometry, material);
        flyline.push(mesh)
    })

    const {polyline} = extrudeGeoJSON(json, {
        depth: 4,
        lineWidth: 0.5,
        bevelSize: 0.05,
        fitRect: {
            x: 0,
            y: 0,
            width: 100
        }
    });
    const {position, normal, indices, boundingRect} = polyline;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(boundingRect.width / 2, boundingRect.height / 2, 150);
    camera.lookAt(new THREE.Vector3(boundingRect.width / 2, boundingRect.height / 2, 0));

    let float32BufferAttribute = new THREE.Float32BufferAttribute(position, 3);
    geometry.addAttribute('position', float32BufferAttribute);
    geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
    geometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1));

    const mesh = new THREE.Mesh(geometry, material);

    // 创建可移动飞线
    var fly = new FlyLines(flyline,float32BufferAttribute);

    fly.mobs.forEach(function (flyLine) {
        scene.add(flyLine.mesh);
    })

    scene.add(mesh);

    const light = new THREE.DirectionalLight('#fff', 1);
    light.position.set(100, 100, 200);
    scene.add(light);

    scene.add(new THREE.HemisphereLight());

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(boundingRect.width / 2, boundingRect.height / 2, 0);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        fly.update();

        // mesh.geometry.attributes.position.needsUpdate = true;
        // mesh.geometry.attributes.normal.needsUpdate = true;
        // mesh.geometry.needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();
}

fetch('./asset/street.geojson')
    .then(res => res.json())
    .then(init);
