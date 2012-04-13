class FetcherController < ApplicationController
  def index
  end
  
  def get_artist
		if params[:q].blank?
      @image = ""
      @bio = ""
		else
			url = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=#{params[:q].gsub(' ','+')}&api_key=#{API_KEY}"
			
			doc = Nokogiri::XML(open(url))
			
			#doc.xpath("lfm/artist/image").each do |img|
			#	puts img
			#end
			
			@q = doc.xpath('lfm/artist/name').text
			
			@image = doc.xpath('lfm/artist/image[@size="mega"]').text
			
			@bio = Sanitize.clean(doc.xpath('lfm/artist/bio').text[0..-125])
		end
    respond_to do |format|
      format.js
    end
	end
end
