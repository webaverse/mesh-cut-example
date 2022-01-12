import * as THREE from 'three'
import metaversefile from 'metaversefile'
import { clamp } from 'three/src/math/MathUtils.js'
const { useApp, useLoaders, useFrame, useActivate, useWear, useUse, useLocalPlayer, usePhysics, useScene, getNextInstanceId, getAppByPhysicsId, useWorld, useDefaultModules, useCleanup } = metaversefile

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1')

export default () => {
  const app = useApp()
  const physics = usePhysics()

  let physicsIds = []
  ;(async () => {
    /*const u = `${baseUrl}sword.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    // const {animations} = o;
    o = o.scene;
    o.scale.set(2,2,2);
    app.add(o);
    console.log(o);

    const physicsId = physics.addGeometry(o);
    physicsIds.push(physicsId);
*/

    const map = new THREE.TextureLoader().load('https://raw.githubusercontent.com/gonnavis/annihilate/1a8536dc019924454a0fc7774a7dfa95a70aed92/image/uv_grid_opengl.jpg')

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const material = new THREE.MeshStandardMaterial({ map })
    const cube = new THREE.Mesh(geometry, material)
    window.cube = cube
    //const cube = new THREE.Mesh( new THREE.SphereGeometry( 0.5, 20, 10 ), material );
    //cube =  new THREE.Mesh( new THREE.TetrahedronGeometry( 0.5, 0 ), material );
    cube.position.set(5, 1, 0)

    app.add(cube)

    cube.updateMatrixWorld()

    // const attrPos = cube.geometry.getAttribute('position')
    const planePosition = new THREE.Vector3(0, 0, 0)
    const planeQuaternion = new THREE.Quaternion(0, 1, 0, 0)
    const planeScale = new THREE.Vector3(1, 1, 1)

    planeQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI * 0.2)

    const index = cube.geometry.getIndex()

    console.log('-geometry: ', geometry)

    console.log('-parameter positions: ', geometry.attributes.position.array)
    console.log('-parameter numPositions: ', geometry.attributes.position.count * 3)
    console.log('-parameter normals: ', geometry.attributes.normal.array)
    console.log('-parameter numNormals: ', geometry.attributes.normal.count * 3)
    console.log('-parameter uvs: ', geometry.attributes.uv.array)
    console.log('-parameter numUvs: ', geometry.attributes.uv.count * 2)
    console.log('-parameter faces: ', index.array)
    console.log('-parameter numFaces: ', index.count)
    console.log('-parameter position: ', planePosition)
    console.log('-parameter quaternion: ', planeQuaternion)
    console.log('-parameter scale: ', planeScale)
    const res = physics.cutMesh(
      geometry.attributes.position.array, 
      geometry.attributes.position.count * 3, 
      geometry.attributes.normal.array, 
      geometry.attributes.normal.count * 3, 
      geometry.attributes.uv.array,
      geometry.attributes.uv.count * 2,
      index.array, 
      index.count, 

      planePosition, 
      planeQuaternion, 
      planeScale
    )

    console.log(res)

    console.log(physics)

    const positions1 = res.outPositions.slice(0, res.numOutPositions[0])
    const positions2 = res.outPositions.slice(res.numOutPositions[0], res.numOutPositions[0] + res.numOutPositions[1])

    const normals1 = res.outNormals.slice(0, res.numOutNormals[0])
    const normals2 = res.outNormals.slice(res.numOutNormals[0], res.numOutNormals[0] + res.numOutNormals[1])

    const uvs1 = res.outUvs.slice(0, res.numOutUvs[0])
    const uvs2 = res.outUvs.slice(res.numOutUvs[0], res.numOutUvs[0] + res.numOutUvs[1])

    const faces1 = res.outFaces.slice(0, res.numOutFaces[0])
    const faces2 = res.outFaces.slice(res.numOutFaces[0], res.numOutFaces[0] + res.numOutFaces[1])

    const geometry2 = new THREE.BufferGeometry()
    geometry2.setIndex(new THREE.Uint32BufferAttribute(faces1, 1))
    geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3))
    geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals1, 3))
    geometry2.setAttribute('uv', new THREE.Float32BufferAttribute(uvs1, 2))

    // const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    const material2 = new THREE.MeshStandardMaterial({ map, side: THREE.DoubleSide })
    const cube2 = new THREE.Mesh(geometry2, material2)
    window.cube2 = cube2
    cube2.position.set(0, 1, 0)
    console.log('geometry2', geometry2)

    //debugger;

    app.add(cube2)

    cube2.updateMatrixWorld()

    const geometry3 = new THREE.BufferGeometry()
    geometry3.setIndex(new THREE.Uint32BufferAttribute(faces2, 1))
    geometry3.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
    geometry3.setAttribute('normal', new THREE.Float32BufferAttribute(normals2, 3))
    geometry3.setAttribute('uv', new THREE.Float32BufferAttribute(uvs2, 2))

    // const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
    const material3 = new THREE.MeshStandardMaterial({ map, side: THREE.DoubleSide })
    const cube3 = new THREE.Mesh(geometry3, material3)
    window.cube3 = cube3
    cube3.position.set(0, 1, 0)
    console.log('geometry3', geometry3)

    app.add(cube3)

    cube3.updateMatrixWorld()
  })()

  useWear((e) => {
    console.log('useWear')
  })

  useUse((e) => {
    console.log('useUse')
  })

  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId)
    }
  })

  return app
}
