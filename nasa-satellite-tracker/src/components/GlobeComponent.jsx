import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Implementación alternativa ya que three-globe puede tener problemas con Vite
const createGlobe = () => {
  const globe = new THREE.Group()
  
  // Crear esfera (globo)
  const geometry = new THREE.SphereGeometry(100, 64, 64)
  const material = new THREE.MeshPhongMaterial({
    color: 0x3a228a,
    emissive: 0x220b5a,
    emissiveIntensity: 0.1,
    shininess: 5
  })
  const sphere = new THREE.Mesh(geometry, material)
  globe.add(sphere)
  
  // Añadir atmósfera
  const atmosphereGeometry = new THREE.SphereGeometry(103, 64, 64)
  const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  })
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  globe.add(atmosphere)
  
  return globe
}

const createSatellite = (color, size = 0.5) => {
  const geometry = new THREE.SphereGeometry(size, 16, 16)
  const material = new THREE.MeshBasicMaterial({ color })
  return new THREE.Mesh(geometry, material)
}

const GlobeComponent = ({ satellites, selectedSatellite, onSelect }) => {
  const globeContainer = useRef(null)
  const sceneRef = useRef(null)
  const satellitesRef = useRef([])

  useEffect(() => {
    // Configuración de Three.js
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x040d21)
    sceneRef.current = scene
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      globeContainer.current.clientWidth / globeContainer.current.clientHeight, 
      0.1, 
      1000
    )
    camera.position.z = 300
    
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(globeContainer.current.clientWidth, globeContainer.current.clientHeight)
    globeContainer.current.appendChild(renderer.domElement)
    
    // Añadir luz
    const light = new THREE.AmbientLight(0x404040)
    scene.add(light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)
    
    // Crear globo
    const globe = createGlobe()
    scene.add(globe)
    
    // Añadir controles
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    
    // Limpiar satélites anteriores
    satellitesRef.current.forEach(sat => scene.remove(sat.object))
    satellitesRef.current = []
    
    // Añadir nuevos satélites
    satellites.forEach(sat => {
      const color = sat.status === 'Operational' ? 0x00ff00 : 0xff0000
      const isSelected = selectedSatellite?.id === sat.id
      const satColor = isSelected ? 0xffff00 : color
      const satSize = isSelected ? 1.0 : 0.5
      
      const satellite = createSatellite(satColor, satSize)
      
      // Convertir coordenadas esféricas a cartesianas
      const phi = (90 - sat.latitude) * (Math.PI / 180)
      const theta = (sat.longitude + 180) * (Math.PI / 180)
      const radius = 100 + (sat.altitude / 1000) * 0.5 // Escalar altitud
      
      satellite.position.set(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
      
      satellite.userData = { satellite: sat }
      scene.add(satellite)
      
      satellitesRef.current.push({
        id: sat.id,
        object: satellite
      })
    })
    
    // Animación
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      
      // Rotar globo lentamente
      globe.rotation.y += 0.001
    }
    animate()
    
    // Manejo de clic
    const handleClick = (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
      )
      
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      
      const intersects = raycaster.intersectObjects(
        satellitesRef.current.map(s => s.object)
      )
      
      if (intersects.length > 0) {
        const clickedSat = intersects[0].object.userData.satellite
        onSelect(clickedSat)
      }
    }
    
    renderer.domElement.addEventListener('click', handleClick)
    
    // Manejo de redimensionamiento
    const handleResize = () => {
      camera.aspect = globeContainer.current.clientWidth / globeContainer.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(globeContainer.current.clientWidth, globeContainer.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', handleClick)
      globeContainer.current?.removeChild(renderer.domElement)
    }
  }, [satellites, selectedSatellite, onSelect])
  
  return <div className="globe-container" ref={globeContainer} style={{ width: '100%', height: '100%' }} />
}

export default GlobeComponent