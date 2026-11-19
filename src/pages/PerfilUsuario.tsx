import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import PostCard from '../components/PostCard'
import { UserContext } from '../context/UserContext'
import { API_URL } from '../api'
import type { Post, User } from '../types'

// perfil publico de cualquier usuario: /usuario/:id
function PerfilUsuario() {
  const { id } = useParams()
  const { usuario } = useContext(UserContext)

  const [perfil, setPerfil] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  // cada vez que cambia el id de la URL volvemos a pedir los datos
  useEffect(() => {
    async function cargarPerfil() {
      setCargando(true)
      setError('')
      try {
        // 1. los datos del usuario
        const respuestaUsuario = await fetch(`${API_URL}/users/${id}`)
        if (respuestaUsuario.status === 404) {
          setError('Ese usuario no existe.')
          return
        }
        if (!respuestaUsuario.ok) {
          throw new Error('Error en la respuesta del servidor: ' + respuestaUsuario.status)
        }
        const dataUsuario: User = await respuestaUsuario.json()
        setPerfil(dataUsuario)

        // 2. sus publicaciones
        const respuestaPosts = await fetch(`${API_URL}/posts?userId=${id}`)
        if (!respuestaPosts.ok) {
          throw new Error('Error en la respuesta del servidor: ' + respuestaPosts.status)
        }
        const dataPosts: Post[] = await respuestaPosts.json()
        setPosts(dataPosts.reverse()) // los mas nuevos primero
      } catch (error) {
        console.error('Error inesperado:', error)
        setError('No se pudo cargar el perfil. Revisá que el BackEnd esté encendido.')
      } finally {
        setCargando(false)
      }
    }

    cargarPerfil()
  }, [id])

  // useParams siempre devuelve texto, por eso lo pasamos a numero para comparar
  // si es el perfil propio, lo mandamos a /perfil que tiene los botones de su cuenta
  if (usuario && usuario.id === Number(id)) {
    return <Navigate to="/perfil" replace />
  }

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-2">Cargando perfil...</p>
      </Container>
    )
  }

  if (error || !perfil) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/">← Volver al inicio</Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* aca arranca la cabecera del perfil */}
      <div className="cabecera-perfil mb-4">
        <div>
          <p className="texto-chico mb-2">Perfil</p>
          <h1 className="h2 mb-1">@{perfil.nickName}</h1>
          <p className="mb-0">
            {posts.length} {posts.length === 1 ? 'publicación' : 'publicaciones'}
          </p>
        </div>
        <Link to="/" className="btn btn-outline-dark">
          ← Volver al feed
        </Link>
      </div>
      {/* aca termina la cabecera del perfil */}

      <h2 className="h4 mb-3">Publicaciones de @{perfil.nickName}</h2>

      {posts.length === 0 ? (
        <Alert variant="info">@{perfil.nickName} todavía no publicó nada.</Alert>
      ) : null}

      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post) => (
          <Col key={post.id}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default PerfilUsuario