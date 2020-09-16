window.onload = async function() {
  console.log("window loaded")
  await initState();
  await renderCityOptions()
  await renderRestaurants()
  closeLoading()
};

function initState () {
  loadDataToStorage()
  loadDataGroupByCity()
  loadChunkRestaurants()
  loadCities()
  
  const data = getRestaurant();
  console.log('initState', data)
}

function closeLoading () {
  const element = document.getElementById('loading')

  element.classList.add('hide')
}

function renderDom (config, id) {
  if (!id) {
    return
  }
  
  mount(render(config), id)
}

function cleanMainDom () {
  getMainDom().innerHTML = ''
}

function createRestaurantDom (list) {
  cleanMainDom()
  const chunkList = chunk(list, 10)
  const page = getPage() || 0
  const currentPage = chunkList.length > page ? page : 0

  chunkList[currentPage].map(item => {
    const config = createRestaurantConfig(item)
    renderDom(config, 'main')
  })
}

function initRestaurant () {
  const restaurants = getRestaurant()
  createRestaurantDom(restaurants)
}

function selectCityRestaurant (city) {
  const restaurantsGroupByCity = getRestaurantsGroupByCity()
  const restaurant = restaurantsGroupByCity[city]
  createRestaurantDom(restaurant)
}

function selectDistrictRestaurant (city, district) {
  const restaurantsGroupByCity = getRestaurantsGroupByCity()
  const restaurants = restaurantsGroupByCity[city]
  const filteredList = restaurants.filter(restaurant => restaurant.Town === district)
  createRestaurantDom(filteredList)
}

function renderRestaurants () {
  const city = selectedCity()
  const district = selectedDistrict()

  if (!city && !district) {
    return initRestaurant()
  }

  if (district) {
    return selectDistrictRestaurant(city, district)
  }

  return selectCityRestaurant(city)
}

function renderOptions (data, id) {
  data.map(name => {
    const config = createOptionConfig(name)
    renderDom(config, id)
  })
}

function renderCityOptions () {
  const cities = getCities()
  renderOptions(Object.keys(cities), 'city-select')
}

function resetDistrictOptions () {
  const element = getDistrictSelectDom()
  element.innerHTML = '<option value="">請選擇鄉鎮區...</option>'
}

function renderDistrictOptions (district) {
  renderOptions(district, 'district-select')
}

function handleSelectCity ({ value }) {
  const cities = getCities()
  const district = cities[value]

  resetDistrictOptions()

  if (!district) {
    return renderRestaurants()
  }

  renderDistrictOptions(district)
  renderRestaurants()
}

function handleSelectDistrict ({ value }) {
  renderRestaurants()
}