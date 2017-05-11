class FetchController < ApplicationController
  GET_INFO_URL = "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&api_key=#{ENV['LAST_FM_API_KEY']}&user="
  GET_FRIENDS_URL = "http://ws.audioscrobbler.com/2.0/?method=user.getfriends&api_key=#{ENV['LAST_FM_API_KEY']}&limit=20&user="

  def index
  end

  def user
    respond_to do |format|
      format.html {
        @username = params[:user]
        render :index
      }
      format.xml {
        username = params[:user].gsub(' ','+')
        begin
          info_xml = Nokogiri::XML(open(GET_INFO_URL + username))
          friends_xml = Nokogiri::XML(open(GET_FRIENDS_URL + username))

          builder = Nokogiri::XML::Builder.new do |xml|
            xml.lfm {
              xml.user {
                user = info_xml.at_xpath('//user')
                xml << user.at_xpath('name').to_xml
                xml << user.at_xpath('url').to_xml
                xml << user.at_xpath('playcount').to_xml
                xml << user.xpath('image').to_xml

                xml.score '1'
              }

              xml.friends {
                friends_xml.xpath('lfm/friends/user').each do |user|
                  xml.user {
                    xml << user.at_xpath('name').to_xml
                    xml << user.at_xpath('url').to_xml
                    xml << user.at_xpath('playcount').to_xml
                    xml << user.xpath('image').to_xml

                    xml.score rand(0..1.0)
                  }
                end
              }
            }
          end
        rescue Exception => e
          # puts e.message
          # puts e.backtrace.join("\n")
          if e.message == '400 Bad Request'
            render xml: { error: 'User not found.' }, status: 400
          else
            render xml: { error: 'Connection to Last.fm failed.' }, status: 500
          end
        else
          render xml: builder.to_xml
        end
      }
    end
  end
end
