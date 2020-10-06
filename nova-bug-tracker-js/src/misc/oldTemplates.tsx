
function oldAddTicketTemplate (
    title = '',
    blankTitleClass = '',
    formattedStatus = '',
    priority = '',
    formattedPriority = '',
    description = '',
    blankDescriptionClass = () => {}
) {
    return (
        <div key='popup-window-outer' className='popup-window-outer'>
            <div key='popupWindow' className='popup-window'>
                <form key='popupWindow_form' method='POST'>
                    <table key='popupWindow_Form_Table'>
                        <tr key='pFTt_title'>
                            <td key='pFTtd_titleName'>Title</td>
                            <td key='pFTtd_titleInput'>
                                <input
                                    key = 'pFTtdi_titleInput'
                                    type = 'text'
                                    value = {title}
                                    onChange = {this.updateTitle}
                                    disabled = {this.state.disabled || false}
                                    className = {`popup-input ${blankTitleClass}`}
                                ></input>
                            </td>
                        </tr>
                        <tr key='pFTt_status'>
                            <td key='pFTtd_titleName'>Status</td>
                            <td key='pFTtd_titleSelect'>
                                <select
                                    key='pFTtdsi_statusSelect'
                                    value={status}
                                    className='dropdown edit-menu-status'
                                    onChange={this.updateStatusMenu}
                                    disabled = {this.state.disabled || false}
                                >
                                    {formattedStatus}
                                </select>
                            </td>
                        </tr>
                        <tr key='pFTt_priority'>
                            <td key='pFTtd_priorityName'>Priority</td>
                            <td key='pFTtd_prioritySelect'>
                                <select
                                    key = 'pFTtdsi_prioritySelect'
                                    value = {priority}
                                    className = 'dropdown edit-menu-priority'
                                    onChange = {this.updatePriorityMenu}
                                    disabled = {this.state.disabled || false}
                                >
                                    {formattedPriority}
                                </select>
                            </td>
                        </tr>
                        <tr key='pFTt_description'>
                            <td key='pFTtd_descriptionName'>Description</td>
                            <td key='pFTtd_descriptionInput'>
                                <textarea
                                    key = 'pFTtdsi_descriptionInput'
                                    value = {description}
                                    onChange = {this.updateDescription}
                                    rows = {8}
                                    cols = {48}
                                    disabled = {this.state.disabled || false}
                                    className = {`popup-input ${blankDescriptionClass}`}
                                ></textarea>
                            </td>
                        </tr>
                    </table>
                    <div key='popupWindow_Form_submitdiv'>
                        <button
                            key = 'popupWindow_Form_submit'
                            type = "button"
                            disabled = {this.state.disabled || false}
                            onClick = {() => this.startPostingData()}
                            className = 'submit-button'
                        >
                            {this.state.buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}