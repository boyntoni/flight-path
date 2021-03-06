class Location
  attr_reader :formatted_name, :google_id

  def initialize(formatted_name, google_id)
    @formatted_name = formatted_name
    @google_id = google_id
  end

  def self.new_from_search(search_term)
    url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=#{search_term}&types=(cities)&language=EN&key=#{ENV["google_api_key"]}"
    response = RestClient.send("get", url)
    raw_data = JSON.parse(response)
    raw_data["predictions"].map do |location|
      formatted_name = location["description"]
      google_id = location["reference"]
      Location.new(formatted_name, google_id)
    end
  end
end
