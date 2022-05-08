import * as THREE from 'three'
import metaversefile from 'metaversefile'
import { clamp } from 'three/src/math/MathUtils.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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

    // const geometryToBeCut = new THREE.BoxGeometry(1, 1, 1)
    let geometryToBeCut = new THREE.TorusKnotGeometry(); geometryToBeCut.scale(0.5, 0.5, 0.5);
    window.geometryToBeCut = geometryToBeCut;
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const material = new THREE.MeshStandardMaterial({ map })
    const cube = new THREE.Mesh(geometryToBeCut, material)
    cube.castShadow = true
    cube.receiveShadow = true
    //const cube = new THREE.Mesh( new THREE.SphereGeometry( 0.5, 20, 10 ), material );
    //cube =  new THREE.Mesh( new THREE.TetrahedronGeometry( 0.5, 0 ), material );
    cube.position.set(5, 1, 0)

    app.add(cube)

    cube.updateMatrixWorld()

    // const attrPos = geometryToBeCut.getAttribute('position')
    const planeNormal = new THREE.Vector3(1, 0, 0).normalize().toArray();
    const planeDistance = 0

    const index = geometryToBeCut.getIndex()

    console.log('-geometryToBeCut: ', geometryToBeCut)

    console.log('-parameter positions: ', geometryToBeCut.attributes.position.array)
    console.log('-parameter numPositions: ', geometryToBeCut.attributes.position.count * 3)
    console.log('-parameter normals: ', geometryToBeCut.attributes.normal.array)
    console.log('-parameter numNormals: ', geometryToBeCut.attributes.normal.count * 3)
    console.log('-parameter uvs: ', geometryToBeCut.attributes.uv.array)
    console.log('-parameter numUvs: ', geometryToBeCut.attributes.uv.count * 2)
    console.log('-parameter faces: ', index.array)
    console.log('-parameter numFaces: ', index.count)
    console.log('-parameter position: ', planeNormal)
    console.log('-parameter quaternion: ', planeDistance)
    const res = physics.cutMesh(
      geometryToBeCut.attributes.position.array, 
      geometryToBeCut.attributes.position.count * 3, 
      geometryToBeCut.attributes.normal.array, 
      geometryToBeCut.attributes.normal.count * 3, 
      geometryToBeCut.attributes.uv.array,
      geometryToBeCut.attributes.uv.count * 2,
      index.array, 
      index.count, 

      planeNormal, 
      planeDistance
    )

    console.log(res)

    console.log(physics)

    const positions1 = res.outPositions.slice(0, res.numOutPositions[0])
    const positions2 = res.outPositions.slice(res.numOutPositions[0], res.numOutPositions[0] + res.numOutPositions[1])

    const normals1 = res.outNormals.slice(0, res.numOutNormals[0])
    const normals2 = res.outNormals.slice(res.numOutNormals[0], res.numOutNormals[0] + res.numOutNormals[1])

    const uvs1 = res.outUvs.slice(0, res.numOutUvs[0])
    const uvs2 = res.outUvs.slice(res.numOutUvs[0], res.numOutUvs[0] + res.numOutUvs[1])

    let geometry2 = new THREE.BufferGeometry()
    window.geometry2 = geometry2;
    // geometry2.setIndex(new THREE.Uint32BufferAttribute(faces1, 1))
    geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3))
    geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals1, 3))
    geometry2.setAttribute('uv', new THREE.Float32BufferAttribute(uvs1, 2))

    // const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    const cube2 = new THREE.Mesh(geometry2, cube.material)
    cube2.castShadow = true
    cube2.receiveShadow = true
    cube2.position.set(-1, 1, 0)
    // console.log('geometry2', geometry2)

    //debugger;

    app.add(cube2)

    cube2.updateMatrixWorld()

    let geometry3 = new THREE.BufferGeometry()
    // geometry3.setIndex(new THREE.Uint32BufferAttribute(faces2, 1))
    geometry3.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
    geometry3.setAttribute('normal', new THREE.Float32BufferAttribute(normals2, 3))
    geometry3.setAttribute('uv', new THREE.Float32BufferAttribute(uvs2, 2))

    // const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
    const cube3 = new THREE.Mesh(geometry3, cube.material)
    cube3.castShadow = true
    cube3.receiveShadow = true
    cube3.position.set(0, 1, 0)
    // console.log('geometry3', geometry3)

    app.add(cube3)

    cube3.updateMatrixWorld()

    // --------------------------------------------------
    
    geometryToBeCut = mergeVertices(geometry2);
    {
      const index = geometryToBeCut.getIndex();
      const planeNormal = new THREE.Vector3(0, 1, 0).normalize().toArray();
      const planeDistance = 0
      const res = physics.cutMesh(
        geometryToBeCut.attributes.position.array, 
        geometryToBeCut.attributes.position.count * 3, 
        geometryToBeCut.attributes.normal.array, 
        geometryToBeCut.attributes.normal.count * 3, 
        geometryToBeCut.attributes.uv.array,
        geometryToBeCut.attributes.uv.count * 2,
        index.array, 
        index.count, 

        planeNormal, 
        planeDistance
      )
      // console.log({res})

      const positions1 = res.outPositions.slice(0, res.numOutPositions[0])
      const positions2 = res.outPositions.slice(res.numOutPositions[0], res.numOutPositions[0] + res.numOutPositions[1])

      const normals1 = res.outNormals.slice(0, res.numOutNormals[0])
      const normals2 = res.outNormals.slice(res.numOutNormals[0], res.numOutNormals[0] + res.numOutNormals[1])

      const uvs1 = res.outUvs.slice(0, res.numOutUvs[0])
      const uvs2 = res.outUvs.slice(res.numOutUvs[0], res.numOutUvs[0] + res.numOutUvs[1])

      let geometry2 = new THREE.BufferGeometry()
      window.geometry2 = geometry2;
      // geometry2.setIndex(new THREE.Uint32BufferAttribute(faces1, 1))
      geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3))
      geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals1, 3))
      geometry2.setAttribute('uv', new THREE.Float32BufferAttribute(uvs1, 2))

      // const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
      const cube2 = new THREE.Mesh(geometry2, cube.material)
      cube2.castShadow = true
      cube2.receiveShadow = true
      cube2.position.set(-3, 1, 0)
      // console.log('geometry2', geometry2)

      //debugger;

      app.add(cube2)

      cube2.updateMatrixWorld()

      let geometry3 = new THREE.BufferGeometry()
      // geometry3.setIndex(new THREE.Uint32BufferAttribute(faces2, 1))
      geometry3.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
      geometry3.setAttribute('normal', new THREE.Float32BufferAttribute(normals2, 3))
      geometry3.setAttribute('uv', new THREE.Float32BufferAttribute(uvs2, 2))

      // const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
      const cube3 = new THREE.Mesh(geometry3, cube.material)
      cube3.castShadow = true
      cube3.receiveShadow = true
      cube3.position.set(-3, 2, 0)
      // console.log('geometry3', geometry3)

      app.add(cube3)

      cube3.updateMatrixWorld()
    }
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
