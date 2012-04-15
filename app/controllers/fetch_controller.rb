class FetchController < ApplicationController
  def index
    @placeholder = "Type the name of a user..."
  end
  
  def user
    username = params[:q].gsub(' ','+')
    get_info_url = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=#{username}&api_key=#{API_KEY}"
    get_friends_url = "http://ws.audioscrobbler.com/2.0/?method=user.getfriends&user=#{username}&api_key=#{API_KEY}"
    
    respond_to do |format|
      format.xml {
        begin
          info_xml = Nokogiri::XML(open(get_info_url))
          friends_xml = Nokogiri::XML(open(get_friends_url))
          builder = Nokogiri::XML::Builder.new do |xml|
            xml.combined {
              xml.userInfo {
                xml << info_xml.at_xpath('//user').to_xml.to_str
              }
              xml.friendsInfo {
                xml << friends_xml.at_xpath('//friends').to_xml.to_str
              }
            }
          end
        rescue Exception => e
          # puts e.message
          # puts e.backtrace.join("\n")
        
          if e.message == '400 Bad Request'
            render xml: { :error => 'User not found.' }, :status => 400
          else
            render xml: { :error => 'Connection to Last.fm failed.' }, :status => 500
          end
        else
          render xml: builder.to_xml
        end
      }
      
      format.html {
        begin
          doc = Nokogiri::XML(open(get_info_url))
        rescue
          @placeholder = "That user does not exist."
          render 'index'
        else
          status = doc.xpath('lfm/@status').text
          if status == 'ok'
            
            @q = doc.at_xpath('lfm/user/name').text
            
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
