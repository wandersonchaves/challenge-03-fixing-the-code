const express = require('express')

const { v4: uuid, validate } = require('uuid')

const app = express()

app.use(express.json())

const repositories = []

app.get('/repositories', (request, response) => {
  return response.json(repositories)
})

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository)

  return response.status(201).json(repository)
})

function isValidId(id) {
  return id && typeof id === 'string' && id.trim().length > 0 && validate(id)
}

function findRepositoryIndexById(id) {
  return repositories.findIndex((repository) => repository.id === id)
}

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  if (!isValidId(id)) {
    return response.status(404).json({ error: 'Invalid repository id.' })
  }

  const repositoryIndex = findRepositoryIndexById(id)

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Mensagem do erro' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
})

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params

  repositoryIndex = repositories.findIndex((repository) => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  )

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' })
  }

  repositories[repositoryIndex].likes += 1

  return response.json(repositories[repositoryIndex])
})

module.exports = app
