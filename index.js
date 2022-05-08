import * as THREE from 'three'
import metaversefile from 'metaversefile'
const { useApp, useWear, useUse, usePhysics, useCleanup } = metaversefile

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1')

export default () => {
  const app = useApp()
  const physics = usePhysics()

  ;(async () => {
    const map = new THREE.TextureLoader().load('https://raw.githubusercontent.com/gonnavis/annihilate/1a8536dc019924454a0fc7774a7dfa95a70aed92/image/uv_grid_opengl.jpg')
    const geometryToBeCut = new THREE.TorusKnotGeometry(); geometryToBeCut.scale(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ map })
    const mesh = new THREE.Mesh(geometryToBeCut, material)
    app.add(mesh)
    mesh.updateMatrixWorld()

    const planeNormal = new THREE.Vector3(1, 0, 0).normalize().toArray();
    const planeDistance = 0

    const index = geometryToBeCut.getIndex()
    const res = physics.cutMesh(
      geometryToBeCut.attributes.position.array, 
      geometryToBeCut.attributes.position.count * 3, 
      geometryToBeCut.attributes.normal.array, 
      geometryToBeCut.attributes.normal.count * 3, 
      geometryToBeCut.attributes.uv.array,
      geometryToBeCut.attributes.uv.count * 2,
      index?.array, 
      index?.count, 

      planeNormal, 
      planeDistance,

      !!geometryToBeCut.index
    )

    const positions1 = res.outPositions.slice(0, res.numOutPositions[0])
    const positions2 = res.outPositions.slice(res.numOutPositions[0], res.numOutPositions[0] + res.numOutPositions[1])

    const normals1 = res.outNormals.slice(0, res.numOutNormals[0])
    const normals2 = res.outNormals.slice(res.numOutNormals[0], res.numOutNormals[0] + res.numOutNormals[1])

    const uvs1 = res.outUvs.slice(0, res.numOutUvs[0])
    const uvs2 = res.outUvs.slice(res.numOutUvs[0], res.numOutUvs[0] + res.numOutUvs[1])

    const geometry2 = new THREE.BufferGeometry()
    geometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3))
    geometry2.setAttribute('normal', new THREE.Float32BufferAttribute(normals1, 3))
    geometry2.setAttribute('uv', new THREE.Float32BufferAttribute(uvs1, 2))

    const mesh2 = new THREE.Mesh(geometry2, material)
    mesh2.castShadow = true
    mesh2.receiveShadow = true
    mesh2.position.set(-1, 1, 0)
    app.add(mesh2)
    mesh2.updateMatrixWorld()

    const geometry3 = new THREE.BufferGeometry()
    geometry3.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3))
    geometry3.setAttribute('normal', new THREE.Float32BufferAttribute(normals2, 3))
    geometry3.setAttribute('uv', new THREE.Float32BufferAttribute(uvs2, 2))

    const mesh3 = new THREE.Mesh(geometry3, mesh.material)
    mesh3.castShadow = true
    mesh3.receiveShadow = true
    mesh3.position.set(0, 1, 0)
    app.add(mesh3)
    mesh3.updateMatrixWorld()
  })()

  useCleanup(() => {
    
  })

  return app
}
