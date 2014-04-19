require "jsduck/tag/tag"

class Facepalm < JsDuck::Tag::Tag
  def initialize
    @tagname = :facepalm
    @pattern = "facepalm"
    @html_position = POS_DOC + 0.1
    @repeatable = true
  end

  def parse_doc(scanner, position)
    name = scanner.match(/.*$/)
    return { :tagname => :facepalm, :name => name, :doc => :multiline }
  end

  def process_doc(context, facepalm_tags, position)
    context[:facepalm] = facepalm_tags
  end

  def format(context, formatter)
    context[:facepalm].each do |facepalm|
      facepalm[:doc] = formatter.format(facepalm[:doc])
    end
  end

  def to_html(context)
    context[:facepalm].map do |facepalm|
      <<-EOHTML
        <h2>#{facepalm[:name]}</h2>
        #{facepalm[:doc]}
        [!images/facepalm.jpg]
      EOHTML
    end.join
  end
end