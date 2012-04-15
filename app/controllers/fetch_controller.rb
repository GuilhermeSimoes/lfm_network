class FetchController < ApplicationController
  def index
    @placeholder = "Type the name of a user..."
  end
  
  def user
    url = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=#{params[:q].gsub(' ','+')}&api_key=#{API_KEY}"
    
    respond_to do |format|
      format.xml {
        begin
          @xml = Nokogiri::XML(open(url))
        rescue Exception => e
          # puts e.message
          # puts e.backtrace.join("\n")
        
          if e.message == '400 Bad Request'
            render xml: { :error => 'User not found.' }, :status => 400
          else
            render xml: { :error => 'Connection to Last.fm failed.' }, :status => 500
          end
        else
          render xml: @xml
        end
      }
      
      format.html {
        begin
          doc = Nokogiri::XML(open(url))
        rescue
          @placeholder = "That user does not exist."
          render 'index'
        else
          status = doc.xpath('lfm/@status').text
          if status == 'ok'          
            #doc.xpath("lfm/artist/image").each do |img|
            #	puts img
            #end
            #@bio = Sanitize.clean(doc.xpath('lfm/artist/bio').text[0..-125])
            
            @q = doc.xpath('lfm/user/name').text
            
            doc.xpath('lfm/user/image').each do |image|
              unless image.nil?
                @image = image.text
              end
            end
            
            render 'user'
          else
            @placeholder = "That user does not exist."
            render 'index'
          end
        end
      }
    end
  end
end
