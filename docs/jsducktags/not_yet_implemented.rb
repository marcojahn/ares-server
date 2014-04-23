require "jsduck/tag/boolean_tag"

class NotYetImplemented < JsDuck::Tag::BooleanTag
  def initialize
    @pattern = "not_yet_implemented"
    @signature = {:long => "Not yet implemented", :short => "nyi"}
    @html_position = POS_DOC + 0.1
    @css = <<-EOCSS
      .signature .not_yet_implemented {
        color: red;
        background: transparent;
        border: 1px solid red;
      }
      .inner-box {
        border-color: red;
      }
    EOCSS
    super
  end

  def to_html(context)
    <<-EOHTML
      <div class='rounded-box inner-box'>
      <p>This functionallity is not yet implemented.</p>
      </div>
    EOHTML
  end
end