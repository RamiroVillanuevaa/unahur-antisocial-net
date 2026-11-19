import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import PostCard from '../components/PostCard'
import { UserContext } from '../context/UserContext'
import { API_URL } from '../api'
import type { Post, Tag } from '../types'

function Home() {
  const { usuario } = useContext(UserContext)

  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [tagElegida, setTagElegida] = useState<number>(0) // 0 = todas
  const [cargando, setCargando] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function cargarFeed() {
      try {
        const respuestaPosts = await fetch(`${API_URL}/posts`)
        if (!respuestaPosts.ok) {
          throw new Error('Error en la respuesta del servidor: ' + respuestaPosts.status)
        }
        const dataPosts: Post[] = await respuestaPosts.json()
        setPosts(dataPosts.reverse()) // los mas nuevos primero

        const respuestaTags = await fetch(`${API_URL}/tags`)
        if (!respuestaTags.ok) {
          throw new Error('Error en la respuesta del servidor: ' + respuestaTags.status)
        }
        const dataTags: Tag[] = await respuestaTags.json()
        setTags(dataTags)
      } catch (error) {
        console.error('Error inesperado:', error)
        setError('[SERVER/BACKEND ERROR] No se pudieron cargar las publicaciones. Volvé a intentarlo mas tarde.')
      } finally {
        setCargando(false)
      }
    }

    cargarFeed()
  }, [])

  const postsFiltrados =
    tagElegida === 0
      ? posts
      : posts.filter((post) => post.Tags?.some((tag) => tag.id === tagElegida))

  return (
    <>
      {/* aca arranca la portada */}
      <section className="banner">
        <Container>
          <p className="texto-chico">Hecho por estudiantes de la UNAHUR</p>
          <h1>
            Menos scroll. <span className="resaltado">Más charla.</span>
          </h1>
          <p className="bajada">
            Publicá, comentá y leé a tu ritmo. Una comunidad chiquita y tranquila, hecha para charlar.
          </p>
          <div className="acciones">
            {usuario ? (
              <Link to="/nuevo-post" className="btn btn-primary">
                Crear una publicación
              </Link>
            ) : (
              <>
                <Link to="/registro" className="btn btn-primary">
                  Sumate a la comunidad
                </Link>
                <Link to="/login" className="btn btn-outline-dark">
                  Ya tengo cuenta
                </Link>
              </>
            )}
          </div>
        </Container>
      </section>
      {/* aca termina la portada */}

      <Container className="py-4">
        <h2 className="mb-3">Publicaciones recientes</h2>

        {/* aca arrancan los filtros por etiqueta */}
        {tags.length > 0 && (
          <div className="filtros mb-3">
            <button
              className={tagElegida === 0 ? 'chip chip-activo' : 'chip'}
              onClick={() => setTagElegida(0)}
            >
              Todas
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={tagElegida === tag.id ? 'chip chip-activo' : 'chip'}
                onClick={() => setTagElegida(tag.id)}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        )}
        {/* aca terminan los filtros */}

        {!cargando && !error && (
          <p className="resultados">Mostrando {postsFiltrados.length} publicaciones</p>
        )}

        {cargando && (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Cargando publicaciones...</p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!cargando && !error && postsFiltrados.length === 0 && (
          <Alert variant="info">Todavía no hay publicaciones para mostrar.</Alert>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {postsFiltrados.map((post) => (
            <Col key={post.id}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>

        <section className="sobre-nosotros mt-5">
          <h2>Sobre nosotros</h2>
          <p>
            UnaHur Anti-Social Net es un proyecto de estudiantes de la Universidad Nacional de Hurlingham.
            Es una red social chiquita y tranquila: sin algoritmos, sin publicidad y sin contador de likes.
          </p>
          <p className="frase mb-0">"Hecho en Hurlingham. Sin apuro."</p>
        </section>
      </Container>
    </>
  )
}

export default Home