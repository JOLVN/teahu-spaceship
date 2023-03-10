import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Textures
 */

const bakedTexture = textureLoader.load(
    'baked_2.jpg'
)
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding


/**
 *  Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

const blueLight = new THREE.MeshBasicMaterial({ color: '#2AF8FF' })
const redLight = new THREE.MeshBasicMaterial({ color: '#FF0500' })

/**
 * Model
 */
gltfLoader.load(
    'spaceship.glb',
    (gltf) => {

        const bakedMesh = gltf.scene.children.find(child => child.name === 'BASE002')
        const motifToit = gltf.scene.children.find(child => child.name === 'Motif_toit')
        const contourAiles = gltf.scene.children.find(child => child.name === 'Contour_ailes')
        const milieuPorte = gltf.scene.children.find(child => child.name === 'Milieu_porte')
        const reacteurArr = gltf.scene.children.find(child => child.name === 'Reacteur_arriere')
        const reacteurCote = gltf.scene.children.find(child => child.name === 'Reacteur_coté')

        bakedMesh.material = bakedMaterial
        motifToit.material = blueLight
        contourAiles.material = blueLight
        milieuPorte.material = blueLight
        reacteurArr.material = redLight
        reacteurCote.material = redLight

        scene.add(gltf.scene)
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 125)
camera.position.x = -5
camera.position.y = 2
camera.position.z = 6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()