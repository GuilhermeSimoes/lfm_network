class FetcherController < ApplicationController
  def index
  end
  
  def get_user
		if params[:q].blank?
      @image = ""
		else
			url = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=#{params[:q].gsub(' ','+')}&api_key=#{API_KEY}"
			
			doc = Nokogiri::XML(open(url))
      
      status = doc.xpath('lfm/@status').text
      
      if status == 'failed'
        @image = ""
        @placeholder = "That user does not exist."
      else
        @placeholder = ""
        
        
        #doc.xpath("lfm/artist/image").each do |img|
        #	puts img
        #end
        
        @q = doc.xpath('lfm/user/name').text
        
        @image = doc.xpath('lfm/user/image[@size="large"]').text
        
        #@bio = Sanitize.clean(doc.xpath('lfm/artist/bio').text[0..-125])
        
      end
		end
      
    respond_to do |format|
      format.js
    end
	end
end
