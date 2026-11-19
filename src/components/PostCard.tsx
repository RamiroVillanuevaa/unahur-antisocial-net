import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import { API_URL } from '../api'
import type { Comment, Post, PostImage } from '../types'

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  const [imagenes, setImagenes] = useState<PostImage[]>([])
  const [cantidadComentarios, setCantidadComentarios] = useState<number>(0)

  // GET /posts no trae imagenes ni comentarios, se piden aparte
  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaImagenes = await fetch(`${API_URL}/postimages/post/${post.id}`)
        if (!respuestaImagenes.ok) {
          throw new Error('Error al traer las imágenes: ' + respuestaImagenes.status)
        }
        const dataImagenes: PostImage[] = await respuestaImagenes.json()
        setImagenes(dataImagenes)

        const respuestaComentarios = await fetch(`${API_URL}/comments/post/${post.id}`)
        if (!respuestaComentarios.ok) {
          throw new Error('Error al traer los comentarios: ' + respuestaComentarios.status)
        }
        const dataComentarios: Comment[] = await respuestaComentarios.json()
        setCantidadComentarios(dataComentarios.length)
      } catch (error) {
        console.error('Error inesperado:', error)
      }
    }

    cargarDatos()
  }, [post.id])

  // la fecha viene del backend en createdAt, la mostramos como dd/mm/aaaa
  const fecha = new Date(post.createdAt).toLocaleDateString('es-AR')

  return (
    // aca arranca la card del post (con las clases "card" de bootstrap)
    <Card className="tarjeta-post h-100">
      {/* en el feed mostramos solo la primera foto, el resto se ve en el detalle */}
      {imagenes.length > 0 ? (
        <img src={imagenes[0].url} alt={'Imagen del post ' + post.id} className="card-img-top imagen-post" />
      ) : null}

      {/* aca arranca la info del post */}
      <Card.Body className="cuerpo-post">
        {/* autor y fecha */}
        <div className="cabecera-post">
          {/* el nombre lleva al perfil del autor */}
          {post.User ? (
            <Link to={`/usuario/${post.UserId}`} className="autor">
              @{post.User.nickName}
            </Link>
          ) : null}
          <p className="fecha">{fecha}</p>
        </div>

        <Card.Text className="descripcion-corta">{post.description}</Card.Text>

        {/* las etiquetas del post */}
        <div className="etiquetas-post">
          {post.Tags?.map((tag) => (
            <span key={tag.id} className="etiqueta-post">
              #{tag.name}
            </span>
          ))}
        </div>

        {/* abajo de todo: cuantos comentarios y fotos tiene, y el boton para ver el detalle */}
        <div className="pie-post">
          <p className="datos-post">
            {cantidadComentarios} {cantidadComentarios === 1 ? 'comentario' : 'comentarios'}
            {imagenes.length > 1 ? ` · ${imagenes.length} fotos` : ''}
          </p>
          <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
            Ver más
          </Link>
        </div>
      </Card.Body>
      {/* aca termina la info del post */}
    </Card>
    // aca termina la card del post
  )
}

export default PostCard