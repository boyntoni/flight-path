class ActivityLocation
  def initialize(name, lat, lng, img_url, rating, address, trip_id)
    @name = name
    @lat = lat
    @lng = lng
    @img_url = img_url
    @rating = rating
    @address = address
    @trip_id = trip_id
  end

  def self.new_from_search(trip)
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=#{trip.lat.to_s},#{trip.lng.to_s}&radius=50000&type=point_of_interest&rankBy=prominence&key=AIzaSyDKctmGykKUI2sTuv_ipJ6bz9wO-WMQ4NA"
    response = RestClient.send("get", url)
    raw_data = JSON.parse(response)

    activities = raw_data["results"].map do |r|
      name = r["name"]
      lat = r["geometry"]["location"]["lat"]
      lng = r["geometry"]["location"]["lng"]

      if r['photos']
        img_url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=#{r['photos'][0]['photo_reference']}&key=AIzaSyDKctmGykKUI2sTuv_ipJ6bz9wO-WMQ4NA"
      else
        img_url = 'https://i0.wp.com/www.historyconfidential.com/wp-content/uploads/2013/04/old_holiday_inn.png'
      end

      rating = r["rating"]
      address = r["vicinity"]
      trip_id = trip.id.to_i
      Activity.new(name: name, lat: lat, lng: lng, img_url: img_url, rating: rating, address: address, trip_id: trip_id)
    end
  end
end
