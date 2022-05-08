import * as THREE from 'three'
import metaversefile from 'metaversefile'
const { useApp, useWear, useUse, usePhysics, useCleanup } = metaversefile

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1')

export default () => {
  const app = useApp()
  const physics = usePhysics()

  ;(async () => {
    const map = new THREE.TextureLoader().load('https://raw.githubusercontent.com/gonnavis/annihilate/1a8536dc019924454a0fc7774a7dfa95a70aed92/image/uv_grid_opengl.jpg')
    const geometryToBeCut = new THREE.BoxGeometry();
    // const geometryToBeCut = new THREE.TorusKnotGeometry(); geometryToBeCut.scale(0.5, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({
      map,
      side: THREE.DoubleSide,
    })
    const meshToBeCut = new THREE.Mesh(geometryToBeCut, material)
    app.add(meshToBeCut)
    meshToBeCut.updateMatrixWorld()

    const getCutGeometries = (geometry, plane) => {
      const res = physics.cutMesh(
        geometry.attributes.position.array, 
        geometry.attributes.position.count * 3, 
        geometry.attributes.normal.array, 
        geometry.attributes.normal.count * 3, 
        geometry.attributes.uv.array,
        geometry.attributes.uv.count * 2,
        geometry.index?.array, 
        geometry.index?.count, 
  
        plane.normal.toArray(), 
        plane.constant,
  
        !!geometry.index
      )
  
      const positions0 = res.outPositions.slice(0, res.numOutPositions[0])
      const positions1 = res.outPositions.slice(res.numOutPositions[0], res.numOutPositions[0] + res.numOutPositions[1])
  
      const normals0 = res.outNormals.slice(0, res.numOutNormals[0])
      const normals1 = res.outNormals.slice(res.numOutNormals[0], res.numOutNormals[0] + res.numOutNormals[1])
  
      const uvs0 = res.outUvs.slice(0, res.numOutUvs[0])
      const uvs1 = res.outUvs.slice(res.numOutUvs[0], res.numOutUvs[0] + res.numOutUvs[1])
  
      const geometry0 = new THREE.BufferGeometry()
      geometry0.setAttribute('position', new THREE.Float32BufferAttribute(positions0, 3))
      geometry0.setAttribute('normal', new THREE.Float32BufferAttribute(normals0, 3))
      geometry0.setAttribute('uv', new THREE.Float32BufferAttribute(uvs0, 2))
  
      const geometry1 = new THREE.BufferGeometry()
      geometry1.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3))
      geometry1.setAttribute('normal', new THREE.Float32BufferAttribute(normals1, 3))
      geometry1.setAttribute('uv', new THREE.Float32BufferAttribute(uvs1, 2))

      return [geometry0, geometry1];
    }

    const geometries2Parts = getCutGeometries(geometryToBeCut, new THREE.Plane(
      new THREE.Vector3(1, 0, 0).normalize(),
      0,
    ));

    const geometries4Parts = [];
    geometries2Parts.forEach(geometryToBeCut => {
      const geometries = getCutGeometries(geometryToBeCut, new THREE.Plane(
        new THREE.Vector3(0, 1, 0).normalize(),
        0,
      ));
      geometries4Parts.push(...geometries);
    })

    const geometries8Parts = [];
    geometries4Parts.forEach(geometryToBeCut => {
      const geometries = getCutGeometries(geometryToBeCut, new THREE.Plane(
        new THREE.Vector3(0, 0, 1).normalize(),
        0,
      ));
      geometries8Parts.push(...geometries);
    })

    //
    
    geometries8Parts.forEach((geometry, i) => {
      const mesh = new THREE.Mesh(geometry, material)
      const x = i < 4 ? -0.5 : 0.5;
      const y = i % 4 < 2 ? -0.5 : 0.5;
      const z = i % 2 < 1 ? -0.5 : 0.5;
      mesh.position.set(x - 3, y, z);
      app.add(mesh)
      mesh.updateMatrixWorld()
    })
  })()

  useCleanup(() => {

  })

  return app
}
