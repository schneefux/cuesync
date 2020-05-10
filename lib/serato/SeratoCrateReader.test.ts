import * as path from 'path'
import * as os from 'os'
import SeratoCrateReader from './SeratoCrateReader'

const fixtures = 'fixtures/'
const reader = new SeratoCrateReader()
const drivePath = path.resolve('/')

test('should list roots', async () => {
  const roots = await reader.listRoots()
  expect(roots).toContain(path.join(os.homedir(), 'Music'))
})

test('should detect crates', async () => {
  const crates = await reader.listCrates(fixtures)
  expect(crates.length).toBe(2)
})

test('should list songs in crate', async () => {
  const songs = await reader.listSongs(path.join(fixtures, '_Serato_', 'Subcrates', 'fixtures.crate'))

  expect(songs.length).toBe(3)
  expect(songs).toMatchObject([
    path.join(drivePath, 'retro_funky.flac'),
    path.join(drivePath, 'retro_funky.mp3'),
    path.join(drivePath, 'retro_funky.ogg'),
  ])
})

test('should list songs in crate', async () => {
  const songs = await reader.listSongs(path.join(fixtures, '_Serato_', 'Subcrates', 'testing.crate'))

  expect(songs.length).toBe(1)
  expect(songs).toMatchObject([
    path.join(drivePath, 'Users/schneefux/Downloads/Persephone - Retro Funky (SUNDANCE remix).mp3'),
  ])
})
