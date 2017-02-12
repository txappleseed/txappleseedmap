require "json"
require "csv"

school_districts_file = File.read("geojson/base_districts.geojson")
school_districts_data = JSON.parse(school_districts_file)

CSV.foreach("data/DistrictPercentage2015.csv", headers: true) do |discipline_row|
  next if discipline_row["feature"] != "D-EXPULSION ACTIONS"

  row_district_id = discipline_row["district"].to_i
  group = discipline_row["group"].downcase.tr(" ", "_")

  school_districts_data["features"].each do |district|
    district_id = district["properties"]["DISTRICT_N"]

    if district_id == row_district_id
      district["properties"]["explusion_percent_#{group}"] = discipline_row["percentage"]
      district["properties"]["explusion_count_#{group}"] = discipline_row["count"]
      district["properties"]["explusion_scale_#{group}"] = discipline_row["scale"]
    end
  end
end

puts school_districts_data["features"][0]["properties"]

# export as json
File.open("geojson/explusion_districts.geojson", "w") do |file|
  file.puts school_districts_data.to_json
end
